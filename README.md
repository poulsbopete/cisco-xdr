# Cisco XDR + Elastic Serverless Demo

A comprehensive demonstration of Agentic AI capabilities integrated with Cisco XDR and Elastic Serverless for advanced threat detection, hunting, and response automation.

## Features

### 1. Automated Threat Hunting
- LLM agents auto-correlate Cisco XDR alerts in Elastic
- Build comprehensive attack timelines
- Generate "threat stories" with narrative summaries

### 2. Alert Triage
- AI-powered noise reduction
- Auto-close low-confidence alerts
- Escalate high-confidence alerts with enriched context

### 3. Incident Case Builder
- Pull related logs and enrich with threat intelligence
- Generate structured case reports with MITRE ATT&CK tags
- Automated evidence collection and correlation

### 4. Response Automation
- Integration with SecureX APIs
- Automated quarantine, domain blocking, and account management
- Human-in-the-loop decision making

### 5. Analyst Copilot
- Vector search for Cisco/Elastic playbooks
- Past incident retrieval and analysis
- Next best action recommendations

### 6. Predictive Defense
- Elastic ML for attack forecasting
- Pre-staging defensive controls in XDR
- Proactive threat prevention

## Architecture

- **Frontend**: React with TypeScript, deployed on AWS CloudFront
- **Backend**: Node.js with AWS Lambda and API Gateway
- **Search & Analytics**: Elastic Serverless
- **AI/ML**: Elastic 1Chat and ML capabilities
- **Security**: Cisco XDR integration

## Quick Start

1. Install dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your AWS and Elastic credentials
```

3. Run locally:
```bash
npm run dev
```

4. Deploy to AWS:
```bash
npm run deploy
```

## Environment Variables

- `ELASTIC_CLOUD_ID`: Your Elastic Cloud deployment ID
- `ELASTIC_API_KEY`: Elastic API key with appropriate permissions
- `AWS_REGION`: AWS region for deployment
- `CISCO_XDR_API_KEY`: Cisco XDR API credentials (for demo purposes)

## Demo Scenarios

The application includes several pre-configured demo scenarios showcasing different use cases:

1. **Ransomware Attack Simulation**: Complete attack timeline with automated response
2. **Phishing Campaign Detection**: Multi-stage attack correlation and mitigation
3. **Insider Threat Investigation**: Behavioral analysis and evidence collection
4. **Supply Chain Compromise**: Advanced persistent threat detection and response

## Contributing

This is a demonstration application. For production use, ensure proper security configurations and compliance with your organization's policies.
