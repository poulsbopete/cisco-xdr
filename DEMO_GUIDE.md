# Cisco XDR + Elastic Demo Guide

## 🎯 Overview

This demo showcases the integration of Cisco XDR with Elastic Serverless and Elastic 1Chat for advanced security operations. The application demonstrates 6 key use cases:

1. **🔍 Automated Threat Hunting** - AI agents auto-correlate alerts and build attack timelines
2. **⚡ Alert Triage** - AI-powered noise reduction and automated escalation
3. **📋 Incident Case Builder** - Automated case generation with MITRE ATT&CK integration
4. **🤖 Response Automation** - SecureX API integration with human-in-the-loop controls
5. **🧠 Analyst Copilot** - Vector search for playbooks and past incident analysis
6. **📈 Predictive Defense** - Elastic ML forecasting with proactive defense automation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AWS CLI configured (for deployment)
- Elastic Cloud Serverless instance
- Cisco XDR API access (optional for demo)

### 1. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your credentials
# - ELASTIC_CLOUD_ID: Your Elastic Cloud URL
# - ELASTIC_API_KEY: Your Elastic API key
# - ELASTICSEARCH_INDEX: Your target index (e.g., search-ciscoxdr)
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

### 3. Generate Sample Data

```bash
# Generate 1000 Cisco XDR sample events
node scripts/run-demo.js --logs

# Or use the interactive menu
node scripts/run-demo.js
```

### 4. Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

## 📊 Demo Scenarios

### Scenario 1: Ransomware Attack Response
1. Navigate to **Threat Hunting** page
2. View the "Ransomware Campaign: Ryuk Variant" threat story
3. Observe the attack timeline and MITRE ATT&CK mapping
4. See AI-generated threat correlation and analysis

### Scenario 2: Alert Triage Automation
1. Go to **Alert Triage** page
2. Review the 5 sample alerts with different severities
3. Test the auto-triage functionality
4. Observe AI recommendations for each alert

### Scenario 3: Incident Case Building
1. Visit **Incident Case Builder** page
2. Select the "APT Campaign Investigation" incident
3. Review the automated evidence collection
4. See the structured case report with recommendations

### Scenario 4: Response Automation
1. Navigate to **Response Automation** page
2. Review the 4 automation rules
3. See recent execution history
4. Test rule toggling and manual execution

### Scenario 5: Analyst Copilot
1. Go to **Analyst Copilot** page
2. Try the chat interface with security questions
3. Browse available playbooks
4. Review past incident lessons learned

### Scenario 6: Predictive Defense
1. Visit **Predictive Defense** page
2. Review the 4 active threat predictions
3. See ML model performance metrics
4. Test action implementation

## 🔧 Configuration

### Elastic Integration

The application connects to your Elastic Cloud Serverless instance using:

```javascript
// Elastic configuration
const ELASTIC_CONFIG = {
  node: 'https://your-instance.es.region.aws.elastic.cloud:443',
  auth: {
    apiKey: 'your-api-key'
  },
  tls: {
    rejectUnauthorized: false
  }
};
```

### Sample Data Generation

The log simulator generates realistic Cisco XDR events including:

- **Malware Detection** - Various malware types with file paths and hashes
- **Network Anomalies** - Unusual traffic patterns and protocols
- **Authentication Failures** - Failed login attempts and brute force
- **Lateral Movement** - SMB, RDP, and other movement indicators
- **Data Exfiltration** - Suspicious data transfer patterns
- **Privilege Escalation** - Token manipulation and service abuse

### MITRE ATT&CK Integration

All events are mapped to MITRE ATT&CK techniques:
- T1055 - Process Injection
- T1071 - Application Layer Protocol
- T1027 - Obfuscated Files or Information
- T1566 - Phishing
- T1486 - Data Encrypted for Impact
- T1110 - Brute Force
- And many more...

## 🛠️ Development

### Project Structure

```
/opt/cisco-xdr/
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/        # Main application pages
│   │   ├── components/   # Reusable components
│   │   └── App.tsx       # Main app component
│   └── package.json
├── backend/               # Node.js API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── config/       # Configuration files
│   │   └── handler.js    # Lambda handler
│   └── serverless.yml    # AWS deployment config
├── scripts/               # Utility scripts
│   ├── cisco-xdr-log-simulator.js
│   ├── elastic-1chat-integration.js
│   └── run-demo.js
├── terraform/             # Infrastructure as code
└── docker-compose.yml     # Local development
```

### API Endpoints

- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/threat-hunting/stories` - Threat stories
- `GET /api/alert-triage/alerts` - Security alerts
- `GET /api/incident-builder/incidents` - Incident cases
- `GET /api/response-automation/rules` - Automation rules
- `GET /api/analyst-copilot/playbooks` - Security playbooks
- `GET /api/predictive-defense/predictions` - Threat predictions

## 🚀 Deployment

### Local Development

```bash
# Using Docker Compose
docker-compose up

# Or manually
npm run dev
```

### AWS Deployment

```bash
# Deploy to AWS
./deploy.sh demo

# Or with specific environment
./deploy.sh production
```

### Environment Variables

Required environment variables:

```bash
# Elastic Configuration
ELASTIC_CLOUD_ID=https://your-instance.es.region.aws.elastic.cloud
ELASTIC_API_KEY=your-elastic-api-key
ELASTICSEARCH_INDEX=search-ciscoxdr

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# Application Configuration
NODE_ENV=development
DEMO_MODE=true
MOCK_DATA_ENABLED=true
```

## 📈 Monitoring and Analytics

### Elastic Dashboards

The application creates several Kibana dashboards:

1. **Security Operations Overview** - High-level metrics and trends
2. **Threat Hunting Dashboard** - Attack timelines and correlations
3. **Alert Triage Analytics** - Alert volume and resolution metrics
4. **Incident Response Tracking** - Case management and response times
5. **Automation Performance** - Rule execution and success rates
6. **Predictive Analytics** - Threat predictions and accuracy

### Key Metrics

- **Alert Volume** - Total alerts by severity and category
- **Threat Detection Rate** - Percentage of threats detected
- **Response Time** - Average time to respond to incidents
- **Automation Success Rate** - Percentage of successful automated responses
- **Prediction Accuracy** - ML model performance metrics

## 🔒 Security Considerations

### Data Privacy
- All sample data is synthetic and doesn't contain real security information
- API keys and credentials are stored in environment variables
- No sensitive data is logged or transmitted

### Network Security
- All communications use HTTPS/TLS
- API endpoints require proper authentication
- CORS is configured for specific origins

### Access Control
- Role-based access control for different user types
- API rate limiting to prevent abuse
- Audit logging for all security operations

## 🆘 Troubleshooting

### Common Issues

1. **Elastic Connection Failed**
   - Verify your Cloud ID and API key
   - Check network connectivity
   - Ensure the index exists

2. **Frontend Not Loading**
   - Check if the backend is running on port 3001
   - Verify CORS configuration
   - Check browser console for errors

3. **Sample Data Not Generated**
   - Verify Elastic credentials
   - Check index permissions
   - Review error logs

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check Elastic connection
node scripts/run-demo.js --test

# Verify sample data
node scripts/run-demo.js --logs
```

## 📚 Additional Resources

- [Elastic Security Documentation](https://www.elastic.co/guide/en/security/current/index.html)
- [Cisco XDR Documentation](https://www.cisco.com/c/en/us/products/security/securex/index.html)
- [MITRE ATT&CK Framework](https://attack.mitre.org/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the application logs
3. Verify your configuration
4. Test individual components

---

**🎉 Enjoy exploring the Cisco XDR + Elastic integration demo!**
