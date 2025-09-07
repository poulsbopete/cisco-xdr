#!/bin/bash

# Cisco XDR + Elastic Demo Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-demo}
AWS_REGION=${AWS_REGION:-us-east-1}
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
TERRAFORM_DIR="terraform"

echo -e "${BLUE}🚀 Starting Cisco XDR + Elastic Demo Deployment${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}AWS Region: ${AWS_REGION}${NC}"

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
    
    # Check if required tools are installed
    command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js is required but not installed.${NC}"; exit 1; }
    command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm is required but not installed.${NC}"; exit 1; }
    command -v aws >/dev/null 2>&1 || { echo -e "${RED}❌ AWS CLI is required but not installed.${NC}"; exit 1; }
    command -v terraform >/dev/null 2>&1 || { echo -e "${RED}❌ Terraform is required but not installed.${NC}"; exit 1; }
    
    # Check AWS credentials
    aws sts get-caller-identity >/dev/null 2>&1 || { echo -e "${RED}❌ AWS credentials not configured.${NC}"; exit 1; }
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Install dependencies
install_dependencies() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    
    # Install root dependencies
    npm install
    
    # Install frontend dependencies
    cd $FRONTEND_DIR
    npm install
    cd ..
    
    # Install backend dependencies
    cd $BACKEND_DIR
    npm install
    cd ..
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Build frontend
build_frontend() {
    echo -e "${YELLOW}🏗️  Building frontend...${NC}"
    
    cd $FRONTEND_DIR
    
    # Create production build
    npm run build
    
    cd ..
    
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    echo -e "${YELLOW}🏗️  Deploying infrastructure with Terraform...${NC}"
    
    cd $TERRAFORM_DIR
    
    # Initialize Terraform
    terraform init
    
    # Plan deployment
    terraform plan -var="environment=$ENVIRONMENT" -var="aws_region=$AWS_REGION"
    
    # Apply deployment
    terraform apply -auto-approve -var="environment=$ENVIRONMENT" -var="aws_region=$AWS_REGION"
    
    cd ..
    
    echo -e "${GREEN}✅ Infrastructure deployed${NC}"
}

# Deploy backend
deploy_backend() {
    echo -e "${YELLOW}🚀 Deploying backend...${NC}"
    
    cd $BACKEND_DIR
    
    # Deploy with Serverless Framework
    npm run deploy:$ENVIRONMENT
    
    cd ..
    
    echo -e "${GREEN}✅ Backend deployed${NC}"
}

# Upload frontend to S3
upload_frontend() {
    echo -e "${YELLOW}📤 Uploading frontend to S3...${NC}"
    
    # Get S3 bucket name from Terraform output
    BUCKET_NAME=$(cd $TERRAFORM_DIR && terraform output -raw s3_bucket_name)
    
    # Upload frontend files
    aws s3 sync $FRONTEND_DIR/dist/ s3://$BUCKET_NAME/ --delete
    
    echo -e "${GREEN}✅ Frontend uploaded to S3${NC}"
}

# Invalidate CloudFront cache
invalidate_cloudfront() {
    echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
    
    # Get CloudFront distribution ID from Terraform output
    DISTRIBUTION_ID=$(cd $TERRAFORM_DIR && terraform output -raw cloudfront_distribution_id)
    
    # Invalidate cache
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
    
    echo -e "${GREEN}✅ CloudFront cache invalidated${NC}"
}

# Display deployment information
show_deployment_info() {
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Deployment Information:${NC}"
    
    # Get outputs from Terraform
    cd $TERRAFORM_DIR
    CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain)
    API_GATEWAY_URL=$(terraform output -raw api_gateway_url)
    cd ..
    
    echo -e "${BLUE}🌐 Frontend URL: https://$CLOUDFRONT_DOMAIN${NC}"
    echo -e "${BLUE}🔗 API Gateway URL: $API_GATEWAY_URL${NC}"
    echo ""
    echo -e "${YELLOW}📝 Next Steps:${NC}"
    echo -e "${YELLOW}1. Configure your Elastic Cloud credentials in the Lambda environment variables${NC}"
    echo -e "${YELLOW}2. Update the frontend configuration to point to the deployed API${NC}"
    echo -e "${YELLOW}3. Test the application functionality${NC}"
    echo ""
    echo -e "${GREEN}✨ Your Cisco XDR + Elastic Demo is now live!${NC}"
}

# Main deployment flow
main() {
    check_prerequisites
    install_dependencies
    build_frontend
    deploy_infrastructure
    deploy_backend
    upload_frontend
    invalidate_cloudfront
    show_deployment_info
}

# Run main function
main "$@"
