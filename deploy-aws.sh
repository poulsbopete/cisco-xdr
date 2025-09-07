#!/bin/bash

# Cisco XDR Demo - AWS Deployment Script
# This script deploys the frontend to CloudFront/S3 and backend to Lambda

set -e

echo "🚀 Starting Cisco XDR Demo AWS Deployment..."

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

# Check if AWS CLI is configured
echo -e "${BLUE}📋 Checking AWS CLI configuration...${NC}"
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo -e "${RED}❌ AWS CLI not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✅ AWS CLI configured for account: $ACCOUNT_ID${NC}"

# Check if required environment variables are set
echo -e "${BLUE}📋 Checking environment variables...${NC}"
if [ -z "$ELASTIC_CLOUD_ID" ] || [ -z "$ELASTIC_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  ELASTIC_CLOUD_ID or ELASTIC_API_KEY not set. Using demo values.${NC}"
    export ELASTIC_CLOUD_ID="demo-cloud-id"
    export ELASTIC_API_KEY="demo-api-key"
fi

export CISCO_XDR_API_KEY=${CISCO_XDR_API_KEY:-"demo-cisco-key"}

# Create terraform.tfvars file
echo -e "${BLUE}📋 Creating Terraform variables file...${NC}"
cat > terraform/terraform.tfvars << EOF
aws_region = "$AWS_REGION"
environment = "$ENVIRONMENT"
elastic_cloud_id = "$ELASTIC_CLOUD_ID"
elastic_api_key = "$ELASTIC_API_KEY"
cisco_xdr_api_key = "$CISCO_XDR_API_KEY"
EOF

# Initialize and apply Terraform
echo -e "${BLUE}🏗️  Initializing Terraform...${NC}"
cd terraform
terraform init

echo -e "${BLUE}📋 Planning Terraform deployment...${NC}"
terraform plan -out=tfplan

echo -e "${BLUE}🚀 Applying Terraform configuration...${NC}"
terraform apply tfplan

# Get outputs
CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain)
API_GATEWAY_URL=$(terraform output -raw api_gateway_url)
S3_BUCKET_NAME=$(terraform output -raw s3_bucket_name)

echo -e "${GREEN}✅ Infrastructure deployed successfully!${NC}"
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "  CloudFront Domain: $CLOUDFRONT_DOMAIN"
echo -e "  API Gateway URL: $API_GATEWAY_URL"
echo -e "  S3 Bucket: $S3_BUCKET_NAME"

cd ..

# Deploy frontend to S3
echo -e "${BLUE}🌐 Deploying frontend to S3...${NC}"
aws s3 sync frontend/dist/ s3://$S3_BUCKET_NAME/ --delete

# Invalidate CloudFront cache
echo -e "${BLUE}🔄 Invalidating CloudFront cache...${NC}"
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='$S3_BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com'].Id" --output text)
if [ ! -z "$DISTRIBUTION_ID" ]; then
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
    echo -e "${GREEN}✅ CloudFront cache invalidated${NC}"
else
    echo -e "${YELLOW}⚠️  Could not find CloudFront distribution for cache invalidation${NC}"
fi

# Test the deployment
echo -e "${BLUE}🧪 Testing deployment...${NC}"
echo -e "${GREEN}✅ Frontend deployed to: https://$CLOUDFRONT_DOMAIN${NC}"
echo -e "${GREEN}✅ Backend API available at: $API_GATEWAY_URL${NC}"

# Create a simple test
echo -e "${BLUE}🔍 Testing API endpoint...${NC}"
if curl -s -f "$API_GATEWAY_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ API health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  API health check failed (this might be normal during cold start)${NC}"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "  1. Visit your application: https://$CLOUDFRONT_DOMAIN"
echo -e "  2. Test the API: $API_GATEWAY_URL/health"
echo -e "  3. Check CloudWatch logs for Lambda function: $ENVIRONMENT-$PROJECT_NAME-api"

# Save deployment info
cat > deployment-info.json << EOF
{
  "deployment_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "aws_region": "$AWS_REGION",
  "environment": "$ENVIRONMENT",
  "cloudfront_domain": "$CLOUDFRONT_DOMAIN",
  "api_gateway_url": "$API_GATEWAY_URL",
  "s3_bucket_name": "$S3_BUCKET_NAME",
  "account_id": "$ACCOUNT_ID"
}
EOF

echo -e "${GREEN}📄 Deployment information saved to deployment-info.json${NC}"
