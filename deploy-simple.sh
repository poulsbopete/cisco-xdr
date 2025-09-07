#!/bin/bash

# Simple AWS Deployment for Cisco XDR Demo
# Uses AWS CLI directly without Terraform

set -e

echo "🚀 Starting Simple AWS Deployment for Cisco XDR Demo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION=${AWS_REGION:-"us-east-1"}
ENVIRONMENT=${ENVIRONMENT:-"demo"}
PROJECT_NAME="cisco-xdr"
BUCKET_NAME="${ENVIRONMENT}-${PROJECT_NAME}-$(date +%s)"

# Check if AWS CLI is configured
echo -e "${BLUE}📋 Checking AWS CLI configuration...${NC}"
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo -e "${RED}❌ AWS CLI not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✅ AWS CLI configured for account: $ACCOUNT_ID${NC}"

# Step 1: Create S3 bucket for frontend
echo -e "${BLUE}🪣 Creating S3 bucket for frontend...${NC}"
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION

# Configure bucket for static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document error.html

# Set bucket policy for public read access
cat > bucket-policy.json << EOF
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

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
rm bucket-policy.json

echo -e "${GREEN}✅ S3 bucket created: $BUCKET_NAME${NC}"

# Step 2: Deploy frontend to S3
echo -e "${BLUE}🌐 Deploying frontend to S3...${NC}"
aws s3 sync frontend/dist/ s3://$BUCKET_NAME/ --delete

echo -e "${GREEN}✅ Frontend deployed to S3${NC}"

# Step 3: Create CloudFront distribution
echo -e "${BLUE}☁️ Creating CloudFront distribution...${NC}"

# Get S3 website endpoint
S3_WEBSITE_ENDPOINT="$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"

# Create CloudFront distribution configuration
cat > cloudfront-config.json << EOF
{
    "CallerReference": "$(date +%s)",
    "Comment": "Cisco XDR Demo Frontend",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$S3_WEBSITE_ENDPOINT",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only",
                    "OriginSSLProtocols": {
                        "Quantity": 1,
                        "Items": ["TLSv1.2"]
                    }
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 3600,
        "MaxTTL": 86400
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
}
EOF

# Create CloudFront distribution
DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution --distribution-config file://cloudfront-config.json)
DISTRIBUTION_ID=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.Id')
DISTRIBUTION_DOMAIN=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.DomainName')

rm cloudfront-config.json

echo -e "${GREEN}✅ CloudFront distribution created: $DISTRIBUTION_DOMAIN${NC}"

# Step 4: Deploy backend using Serverless Framework
echo -e "${BLUE}⚡ Deploying backend to Lambda...${NC}"

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    echo -e "${YELLOW}⚠️  Serverless Framework not found. Installing...${NC}"
    npm install -g serverless
fi

# Deploy backend
cd backend
serverless deploy --region $AWS_REGION --stage $ENVIRONMENT

# Get API Gateway URL
API_URL=$(serverless info --region $AWS_REGION --stage $ENVIRONMENT | grep "endpoint:" | awk '{print $2}')

cd ..

echo -e "${GREEN}✅ Backend deployed to Lambda: $API_URL${NC}"

# Step 5: Test deployment
echo -e "${BLUE}🧪 Testing deployment...${NC}"

# Wait a moment for CloudFront to propagate
echo -e "${YELLOW}⏳ Waiting for CloudFront to propagate (this may take a few minutes)...${NC}"

# Test API endpoint
if curl -s -f "$API_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ API health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  API health check failed (this might be normal during cold start)${NC}"
fi

# Save deployment info
cat > deployment-info.json << EOF
{
  "deployment_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "aws_region": "$AWS_REGION",
  "environment": "$ENVIRONMENT",
  "cloudfront_domain": "$DISTRIBUTION_DOMAIN",
  "api_gateway_url": "$API_URL",
  "s3_bucket_name": "$BUCKET_NAME",
  "s3_website_url": "http://$S3_WEBSITE_ENDPOINT",
  "account_id": "$ACCOUNT_ID",
  "distribution_id": "$DISTRIBUTION_ID"
}
EOF

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "  🌐 Frontend URL: https://$DISTRIBUTION_DOMAIN"
echo -e "  🪣 S3 Website: http://$S3_WEBSITE_ENDPOINT"
echo -e "  ⚡ API URL: $API_URL"
echo -e "  🪣 S3 Bucket: $BUCKET_NAME"
echo -e "  ☁️ CloudFront ID: $DISTRIBUTION_ID"

echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "  1. Visit your application: https://$DISTRIBUTION_DOMAIN"
echo -e "  2. Test the API: $API_URL/health"
echo -e "  3. Check CloudWatch logs for Lambda function"
echo -e "  4. Deployment info saved to deployment-info.json"

echo -e "${YELLOW}⚠️  Note: CloudFront distribution may take 10-15 minutes to fully propagate globally.${NC}"
