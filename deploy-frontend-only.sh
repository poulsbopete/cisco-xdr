#!/bin/bash

# Quick Frontend-Only Deployment to AWS S3 + CloudFront
# This script only deploys the frontend, assumes backend is already deployed

set -e

echo "🚀 Deploying Cisco XDR Frontend to AWS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION=${AWS_REGION:-"us-east-1"}
BUCKET_NAME=${BUCKET_NAME:-"cisco-xdr-demo-$(date +%s)"}

# Check if AWS CLI is configured
echo -e "${BLUE}📋 Checking AWS CLI configuration...${NC}"
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo -e "${RED}❌ AWS CLI not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configured${NC}"

# Build frontend if not already built
if [ ! -d "frontend/dist" ]; then
    echo -e "${BLUE}🔨 Building frontend...${NC}"
    cd frontend
    npm run build
    cd ..
fi

# Create S3 bucket
echo -e "${BLUE}🪣 Creating S3 bucket: $BUCKET_NAME${NC}"
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION

# Configure for static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Set public read policy
cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file:///tmp/bucket-policy.json
rm /tmp/bucket-policy.json

# Upload files
echo -e "${BLUE}📤 Uploading frontend files...${NC}"
aws s3 sync frontend/dist/ s3://$BUCKET_NAME/ --delete

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"

echo -e "${GREEN}🎉 Frontend deployed successfully!${NC}"
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "  🌐 Website URL: $WEBSITE_URL"
echo -e "  🪣 S3 Bucket: $BUCKET_NAME"
echo -e "  📍 Region: $AWS_REGION"

echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "  1. Visit your application: $WEBSITE_URL"
echo -e "  2. To create a CloudFront distribution, run:"
echo -e "     aws cloudfront create-distribution --distribution-config file://cloudfront-config.json"

# Save deployment info
cat > frontend-deployment.json << EOF
{
  "deployment_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "website_url": "$WEBSITE_URL",
  "s3_bucket": "$BUCKET_NAME",
  "aws_region": "$AWS_REGION"
}
EOF

echo -e "${GREEN}📄 Deployment info saved to frontend-deployment.json${NC}"
