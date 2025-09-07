# Cisco XDR + Elastic Demo Infrastructure
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "demo"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "cisco-xdr-demo.com"
}

# S3 Bucket for frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.environment}-cisco-xdr-frontend-${random_string.bucket_suffix.result}"
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.frontend]
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.frontend.website_endpoint
    origin_id   = "S3-${aws_s3_bucket.frontend.bucket}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.frontend.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  # Cache behavior for API calls
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "api-gateway"

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Content-Type"]
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # API Gateway origin
  origin {
    domain_name = replace(aws_api_gateway_rest_api.api.execution_arn, "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:", "")
    origin_id   = "api-gateway"
    origin_path = "/${aws_api_gateway_deployment.api.stage_name}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "${var.environment}-cisco-xdr-frontend"
    Environment = var.environment
  }
}

# API Gateway
resource "aws_api_gateway_rest_api" "api" {
  name        = "${var.environment}-cisco-xdr-api"
  description = "Cisco XDR + Elastic Demo API"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name        = "${var.environment}-cisco-xdr-api"
    Environment = var.environment
  }
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_method.proxy.resource_id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.api.invoke_arn
}

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_rest_api.api.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_method.proxy_root.resource_id
  http_method = aws_api_gateway_method.proxy_root.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.api.invoke_arn
}

resource "aws_api_gateway_deployment" "api" {
  depends_on = [
    aws_api_gateway_integration.lambda,
    aws_api_gateway_integration.lambda_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = var.environment
}

# Lambda Function
resource "aws_lambda_function" "api" {
  filename         = "api.zip"
  function_name    = "${var.environment}-cisco-xdr-api"
  role            = aws_iam_role.lambda_role.arn
  handler         = "src/handler.handler"
  source_code_hash = data.archive_file.api_zip.output_base64sha256
  runtime         = "nodejs18.x"
  timeout         = 30

  environment {
    variables = {
      NODE_ENV = var.environment
      ELASTIC_CLOUD_ID = var.elastic_cloud_id
      ELASTIC_API_KEY = var.elastic_api_key
      CISCO_XDR_API_KEY = var.cisco_xdr_api_key
      DEMO_MODE = "true"
      MOCK_DATA_ENABLED = "true"
    }
  }

  tags = {
    Name        = "${var.environment}-cisco-xdr-api"
    Environment = var.environment
  }
}

# Lambda permissions
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.environment}-cisco-xdr-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Data sources
data "aws_caller_identity" "current" {}

data "archive_file" "api_zip" {
  type        = "zip"
  source_dir  = "../backend"
  output_path = "api.zip"
  excludes    = ["node_modules", ".git", "*.log"]
}

# Variables for sensitive data
variable "elastic_cloud_id" {
  description = "Elastic Cloud ID"
  type        = string
  sensitive   = true
}

variable "elastic_api_key" {
  description = "Elastic API Key"
  type        = string
  sensitive   = true
}

variable "cisco_xdr_api_key" {
  description = "Cisco XDR API Key"
  type        = string
  sensitive   = true
}

# Outputs
output "cloudfront_domain" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "api_gateway_url" {
  description = "API Gateway URL"
  value       = "https://${aws_api_gateway_rest_api.api.id}.execute-api.${var.aws_region}.amazonaws.com/${var.environment}"
}

output "s3_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = aws_s3_bucket.frontend.bucket
}
