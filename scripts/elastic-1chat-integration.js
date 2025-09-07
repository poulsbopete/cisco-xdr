#!/usr/bin/env node

/**
 * Elastic 1Chat Integration for Cisco XDR Demo
 * Demonstrates how to use Elastic 1Chat APIs for security analysis
 */

const fetch = require('node-fetch').default || require('node-fetch');

// Elastic 1Chat configuration
const ELASTIC_1CHAT_CONFIG = {
  host: 'https://ai-assistants-ffcafb.kb.us-east-1.aws.elastic.cloud',
  apiKey: 'bXlUWjRwZ0JrYW1ldk9CQUJtLVU6TWNtdmRKcnRMbnpxQU5QYzA0Vy1aQQ=='
};

// Security analysis prompts for different use cases
const SECURITY_PROMPTS = {
  threat_hunting: `
    Analyze the following security events and identify potential threats:
    - Look for patterns that indicate APT campaigns
    - Identify lateral movement attempts
    - Detect data exfiltration indicators
    - Correlate events across time and assets
    - Provide MITRE ATT&CK technique mapping
  `,
  
  alert_triage: `
    Review these security alerts and provide triage recommendations:
    - Assess the confidence level of each alert
    - Identify false positives vs true threats
    - Prioritize alerts by severity and impact
    - Suggest automated response actions
    - Recommend manual investigation steps
  `,
  
  incident_response: `
    Analyze this security incident and provide response guidance:
    - Determine the scope and impact of the incident
    - Identify the attack vector and timeline
    - Recommend containment and eradication steps
    - Suggest evidence collection procedures
    - Provide recovery and lessons learned recommendations
  `,
  
  predictive_analysis: `
    Analyze historical security data to predict future threats:
    - Identify trends and patterns in attack methods
    - Predict likely attack vectors based on current indicators
    - Assess organizational risk exposure
    - Recommend proactive security measures
    - Suggest threat hunting priorities
  `
};

// Sample security events for analysis
const SAMPLE_EVENTS = [
  {
    timestamp: '2024-01-15T10:30:00Z',
    event_type: 'malware_detected',
    severity: 'high',
    source: { asset: 'WORKSTATION-001', user: 'john.doe', ip: '192.168.1.10' },
    malware: { name: 'Trojan.Win32.Generic', file_path: 'C:\\Windows\\Temp\\svchost.exe' },
    mitre_techniques: [{ id: 'T1055', name: 'Process Injection' }]
  },
  {
    timestamp: '2024-01-15T10:32:00Z',
    event_type: 'network_anomaly',
    severity: 'medium',
    source: { asset: 'WORKSTATION-001', user: 'john.doe', ip: '192.168.1.10' },
    destination: { ip: '203.0.113.1', port: 443 },
    network: { protocol: 'HTTPS', bytes_transferred: 1048576, direction: 'outbound' }
  },
  {
    timestamp: '2024-01-15T10:35:00Z',
    event_type: 'lateral_movement',
    severity: 'critical',
    source: { asset: 'WORKSTATION-001', user: 'john.doe', ip: '192.168.1.10' },
    destination: { ip: '192.168.1.11', port: 445 },
    lateral_movement: { type: 'smb', target_system: 'WORKSTATION-002', success: true }
  }
];

// Make API request to Elastic 1Chat
async function callElastic1Chat(prompt, context = '') {
  try {
    const url = `${ELASTIC_1CHAT_CONFIG.host}/api/chat/converse`;
    
    const requestBody = {
      input: prompt,
      context: context,
      options: {
        temperature: 0.7,
        max_tokens: 2000
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${ELASTIC_1CHAT_CONFIG.apiKey}`,
        'kbn-xsrf': 'true'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error calling Elastic 1Chat:', error.message);
    throw error;
  }
}

// Get available tools from Elastic 1Chat
async function getAvailableTools() {
  try {
    const url = `${ELASTIC_1CHAT_CONFIG.host}/api/chat/tools`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `ApiKey ${ELASTIC_1CHAT_CONFIG.apiKey}`,
        'kbn-xsrf': 'true'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('❌ Error getting available tools:', error.message);
    throw error;
  }
}

// Analyze security events with Elastic 1Chat
async function analyzeSecurityEvents(events, analysisType = 'threat_hunting') {
  try {
    console.log(`🔍 Analyzing ${events.length} security events for ${analysisType}...`);
    
    const prompt = SECURITY_PROMPTS[analysisType] || SECURITY_PROMPTS.threat_hunting;
    const context = JSON.stringify(events, null, 2);
    
    const response = await callElastic1Chat(prompt, context);
    
    console.log('✅ Analysis completed!');
    console.log('📊 Results:');
    console.log(response.response?.message || 'No response message');
    
    return response;
  } catch (error) {
    console.error('❌ Error analyzing security events:', error.message);
    throw error;
  }
}

// Generate threat hunting query
async function generateThreatHuntingQuery(threatType = 'APT') {
  try {
    const prompt = `
      Generate an Elasticsearch query for threat hunting based on the following requirements:
      - Threat type: ${threatType}
      - Look for indicators of compromise
      - Include MITRE ATT&CK techniques
      - Focus on lateral movement and persistence
      - Return a JSON query that can be used with Elasticsearch
    `;
    
    const response = await callElastic1Chat(prompt);
    
    console.log('🎯 Generated threat hunting query:');
    console.log(response.response?.message || 'No response message');
    
    return response;
  } catch (error) {
    console.error('❌ Error generating threat hunting query:', error.message);
    throw error;
  }
}

// Create security dashboard recommendations
async function createDashboardRecommendations() {
  try {
    const prompt = `
      Create recommendations for a security operations dashboard based on Cisco XDR data:
      - Key metrics to display
      - Visualizations for threat trends
      - Alert correlation views
      - Incident response workflows
      - Provide specific Kibana dashboard configurations
    `;
    
    const response = await callElastic1Chat(prompt);
    
    console.log('📊 Dashboard recommendations:');
    console.log(response.response?.message || 'No response message');
    
    return response;
  } catch (error) {
    console.error('❌ Error creating dashboard recommendations:', error.message);
    throw error;
  }
}

// Generate incident response playbook
async function generateIncidentResponsePlaybook(incidentType = 'Ransomware') {
  try {
    const prompt = `
      Generate a comprehensive incident response playbook for ${incidentType} attacks:
      - Detection and analysis steps
      - Containment procedures
      - Eradication methods
      - Recovery processes
      - Post-incident activities
      - Include specific technical details and commands
    `;
    
    const response = await callElastic1Chat(prompt);
    
    console.log(`📋 ${incidentType} incident response playbook:`);
    console.log(response.response?.message || 'No response message');
    
    return response;
  } catch (error) {
    console.error('❌ Error generating incident response playbook:', error.message);
    throw error;
  }
}

// Main demonstration function
async function runElastic1ChatDemo() {
  console.log('🤖 Elastic 1Chat Integration Demo for Cisco XDR');
  console.log('=' .repeat(60));
  
  try {
    // 1. Get available tools
    console.log('\n1️⃣ Getting available tools...');
    const tools = await getAvailableTools();
    console.log(`✅ Found ${tools.length} available tools`);
    tools.slice(0, 5).forEach(tool => {
      console.log(`   - ${tool.id}: ${tool.description}`);
    });
    
    // 2. Analyze sample security events
    console.log('\n2️⃣ Analyzing sample security events...');
    await analyzeSecurityEvents(SAMPLE_EVENTS, 'threat_hunting');
    
    // 3. Generate threat hunting query
    console.log('\n3️⃣ Generating threat hunting query...');
    await generateThreatHuntingQuery('APT');
    
    // 4. Create dashboard recommendations
    console.log('\n4️⃣ Creating dashboard recommendations...');
    await createDashboardRecommendations();
    
    // 5. Generate incident response playbook
    console.log('\n5️⃣ Generating incident response playbook...');
    await generateIncidentResponsePlaybook('Ransomware');
    
    console.log('\n✅ Elastic 1Chat integration demo completed!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
Elastic 1Chat Integration for Cisco XDR Demo

Usage: node elastic-1chat-integration.js [options]

Options:
  --demo                 Run full demonstration
  --analyze <type>       Analyze security events (threat_hunting, alert_triage, incident_response, predictive_analysis)
  --query <threat>       Generate threat hunting query
  --dashboard           Create dashboard recommendations
  --playbook <type>     Generate incident response playbook
  --tools               List available tools
  --help                Show this help message

Examples:
  node elastic-1chat-integration.js --demo
  node elastic-1chat-integration.js --analyze threat_hunting
  node elastic-1chat-integration.js --query APT
  node elastic-1chat-integration.js --playbook Ransomware
    `);
    process.exit(0);
  }
  
  if (args.includes('--demo')) {
    runElastic1ChatDemo();
  } else if (args.includes('--analyze')) {
    const type = args[args.indexOf('--analyze') + 1] || 'threat_hunting';
    analyzeSecurityEvents(SAMPLE_EVENTS, type);
  } else if (args.includes('--query')) {
    const threat = args[args.indexOf('--query') + 1] || 'APT';
    generateThreatHuntingQuery(threat);
  } else if (args.includes('--dashboard')) {
    createDashboardRecommendations();
  } else if (args.includes('--playbook')) {
    const type = args[args.indexOf('--playbook') + 1] || 'Ransomware';
    generateIncidentResponsePlaybook(type);
  } else if (args.includes('--tools')) {
    getAvailableTools().then(tools => {
      console.log('Available tools:');
      tools.forEach(tool => {
        console.log(`- ${tool.id}: ${tool.description}`);
      });
    });
  } else {
    console.log('Use --help to see available options');
  }
}

module.exports = {
  callElastic1Chat,
  getAvailableTools,
  analyzeSecurityEvents,
  generateThreatHuntingQuery,
  createDashboardRecommendations,
  generateIncidentResponsePlaybook
};
