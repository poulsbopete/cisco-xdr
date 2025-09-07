#!/bin/bash

# Deploy Cisco XDR Frontend to AWS S3 + CloudFront
# Uses CloudFront for secure, fast delivery without public S3 access

set -e

echo "🚀 Deploying Cisco XDR Frontend to AWS S3 + CloudFront..."

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

# Create S3 bucket (private, no public access needed)
echo -e "${BLUE}🪣 Creating S3 bucket: $BUCKET_NAME${NC}"
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION

# Upload files to S3
echo -e "${BLUE}📤 Uploading frontend files to S3...${NC}"
aws s3 sync frontend/dist/ s3://$BUCKET_NAME/ --delete

# Create CloudFront Origin Access Control (OAC)
echo -e "${BLUE}🔐 Creating CloudFront Origin Access Control...${NC}"
OAC_OUTPUT=$(aws cloudfront create-origin-access-control --origin-access-control-config '{
    "Name": "cisco-xdr-oac",
    "Description": "OAC for Cisco XDR Demo",
    "SigningProtocol": "sigv4",
    "SigningBehavior": "always",
    "OriginAccessControlOriginType": "s3"
}')

OAC_ID=$(echo $OAC_OUTPUT | jq -r '.OriginAccessControl.Id')

# Create CloudFront distribution
echo -e "${BLUE}☁️ Creating CloudFront distribution...${NC}"

cat > /tmp/cloudfront-config.json << EOF
{
    "CallerReference": "$(date +%s)",
    "Comment": "Cisco XDR Demo Frontend",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3.$AWS_REGION.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                },
                "OriginAccessControlId": "$OAC_ID"
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

DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution --distribution-config file:///tmp/cloudfront-config.json)
DISTRIBUTION_ID=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.Id')
DISTRIBUTION_DOMAIN=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.DomainName')

rm /tmp/cloudfront-config.json

# Update S3 bucket policy to allow CloudFront access
echo -e "${BLUE}🔧 Updating S3 bucket policy for CloudFront...${NC}"

# Get CloudFront service principal
CLOUDFRONT_PRINCIPAL="arn:aws:iam::cloudfront:user/CloudFront Origin Access Control $OAC_ID"

cat > /tmp/s3-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "arn:aws:cloudfront::$(aws sts get-caller-identity --query Account --output text):distribution/$DISTRIBUTION_ID"
                }
            }
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file:///tmp/s3-policy.json
rm /tmp/s3-policy.json

echo -e "${GREEN}🎉 Frontend deployed successfully!${NC}"
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "  🌐 CloudFront URL: https://$DISTRIBUTION_DOMAIN"
echo -e "  🪣 S3 Bucket: $BUCKET_NAME"
echo -e "  ☁️ CloudFront ID: $DISTRIBUTION_ID"
echo -e "  📍 Region: $AWS_REGION"

echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "  1. Wait 5-10 minutes for CloudFront to propagate"
echo -e "  2. Visit your application: https://$DISTRIBUTION_DOMAIN"
echo -e "  3. To deploy backend, run: cd backend && serverless deploy"

# Save deployment info
cat > cloudfront-deployment.json << EOF
{
  "deployment_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "cloudfront_url": "https://$DISTRIBUTION_DOMAIN",
  "s3_bucket": "$BUCKET_NAME",
  "cloudfront_id": "$DISTRIBUTION_ID",
  "aws_region": "$AWS_REGION"
}
EOF

echo -e "${GREEN}📄 Deployment info saved to cloudfront-deployment.json${NC}"
echo -e "${YELLOW}⚠️  Note: CloudFront distribution may take 10-15 minutes to fully propagate globally.${NC}"
