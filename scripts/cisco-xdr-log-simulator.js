#!/usr/bin/env node

/**
 * Cisco XDR Log Simulator
 * Generates realistic security events and logs that would typically be found in Cisco XDR
 */

const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const path = require('path');

// Elastic configuration
const ELASTIC_CONFIG = {
  node: process.env.ELASTIC_CLOUD_ID || 'https://ai-assistants-ffcafb.es.us-east-1.aws.elastic.cloud:443',
  auth: {
    apiKey: process.env.ELASTIC_API_KEY || 'bXlUWjRwZ0JrYW1ldk9CQUJtLVU6TWNtdmRKcnRMbnpxQU5QYzA0Vy1aQQ=='
  },
  tls: {
    rejectUnauthorized: false
  }
};

const INDEX_NAME = process.env.ELASTICSEARCH_INDEX || 'search-ciscoxdr';

// Initialize Elastic client
const client = new Client(ELASTIC_CONFIG);

// Asset inventory for realistic simulation
const ASSETS = {
  endpoints: [
    'WORKSTATION-001', 'WORKSTATION-002', 'WORKSTATION-003', 'WORKSTATION-004', 'WORKSTATION-005',
    'LAPTOP-001', 'LAPTOP-002', 'LAPTOP-003', 'LAPTOP-004', 'LAPTOP-005',
    'SERVER-001', 'SERVER-002', 'SERVER-003', 'SERVER-004', 'SERVER-005',
    'DESKTOP-001', 'DESKTOP-002', 'DESKTOP-003', 'DESKTOP-004', 'DESKTOP-005'
  ],
  users: [
    'john.doe', 'jane.smith', 'mike.johnson', 'sarah.wilson', 'david.brown',
    'lisa.garcia', 'robert.miller', 'jennifer.davis', 'william.rodriguez', 'mary.martinez',
    'admin.user', 'service.account', 'guest.user', 'test.user', 'demo.user'
  ],
  domains: [
    'company.com', 'internal.local', 'dev.company.com', 'test.company.com', 'staging.company.com'
  ],
  ips: [
    '192.168.1.10', '192.168.1.11', '192.168.1.12', '192.168.1.13', '192.168.1.14',
    '10.0.0.10', '10.0.0.11', '10.0.0.12', '10.0.0.13', '10.0.0.14',
    '172.16.0.10', '172.16.0.11', '172.16.0.12', '172.16.0.13', '172.16.0.14'
  ],
  externalIps: [
    '203.0.113.1', '203.0.113.2', '203.0.113.3', '198.51.100.1', '198.51.100.2',
    '185.199.108.153', '140.82.112.3', '151.101.193.140', '104.16.132.229'
  ]
};

// MITRE ATT&CK techniques for realistic threat simulation
const MITRE_TECHNIQUES = {
  'T1055': 'Process Injection',
  'T1071': 'Application Layer Protocol',
  'T1027': 'Obfuscated Files or Information',
  'T1566': 'Phishing',
  'T1486': 'Data Encrypted for Impact',
  'T1110': 'Brute Force',
  'T1041': 'Exfiltration Over C2 Channel',
  'T1204': 'User Execution',
  'T1059': 'Command and Scripting Interpreter',
  'T1070': 'Indicator Removal on Host',
  'T1083': 'File and Directory Discovery',
  'T1018': 'Remote System Discovery',
  'T1021': 'Remote Services',
  'T1105': 'Ingress Tool Transfer',
  'T1033': 'System Owner/User Discovery'
};

// Event types and their characteristics
const EVENT_TYPES = {
  'malware_detected': {
    frequency: 0.15,
    severity: 'high',
    description: 'Malware detected on endpoint',
    mitre: ['T1055', 'T1027', 'T1059'],
    fields: {
      malware_name: ['Trojan.Win32.Generic', 'Backdoor.Win32.RemoteAccess', 'Ransomware.Win32.Ryuk', 'Trojan.Win32.Emotet'],
      file_path: ['C:\\Windows\\Temp\\', 'C:\\Users\\', 'C:\\ProgramData\\', 'C:\\Temp\\'],
      file_name: ['svchost.exe', 'explorer.exe', 'notepad.exe', 'calc.exe', 'winlogon.exe']
    }
  },
  'network_anomaly': {
    frequency: 0.20,
    severity: 'medium',
    description: 'Unusual network traffic pattern detected',
    mitre: ['T1071', 'T1041', 'T1018'],
    fields: {
      protocol: ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'SMB'],
      port: [80, 443, 22, 23, 25, 53, 135, 139, 445, 3389, 5985, 5986],
      direction: ['inbound', 'outbound', 'lateral']
    }
  },
  'authentication_failure': {
    frequency: 0.25,
    severity: 'low',
    description: 'Failed authentication attempt',
    mitre: ['T1110', 'T1078'],
    fields: {
      auth_method: ['password', 'kerberos', 'ntlm', 'ldap'],
      failure_reason: ['invalid_credentials', 'account_locked', 'password_expired', 'account_disabled']
    }
  },
  'file_access_anomaly': {
    frequency: 0.10,
    severity: 'medium',
    description: 'Unusual file access pattern',
    mitre: ['T1083', 'T1041'],
    fields: {
      access_type: ['read', 'write', 'delete', 'execute'],
      file_type: ['.exe', '.dll', '.sys', '.bat', '.ps1', '.vbs', '.docx', '.pdf', '.xlsx']
    }
  },
  'process_anomaly': {
    frequency: 0.12,
    severity: 'high',
    description: 'Suspicious process execution',
    mitre: ['T1059', 'T1055', 'T1204'],
    fields: {
      process_name: ['powershell.exe', 'cmd.exe', 'wscript.exe', 'cscript.exe', 'regsvr32.exe', 'rundll32.exe'],
      command_line: ['-enc', '-e', '-c', 'Invoke-Expression', 'IEX', 'DownloadString']
    }
  },
  'lateral_movement': {
    frequency: 0.08,
    severity: 'critical',
    description: 'Potential lateral movement detected',
    mitre: ['T1021', 'T1018', 'T1071'],
    fields: {
      movement_type: ['smb', 'rdp', 'wmi', 'psremoting', 'ssh'],
      target_system: ['SERVER-001', 'SERVER-002', 'WORKSTATION-001', 'WORKSTATION-002']
    }
  },
  'data_exfiltration': {
    frequency: 0.05,
    severity: 'critical',
    description: 'Potential data exfiltration attempt',
    mitre: ['T1041', 'T1071', 'T1020'],
    fields: {
      data_type: ['customer_data', 'financial_records', 'intellectual_property', 'personal_info', 'credentials'],
      exfiltration_method: ['http', 'https', 'dns', 'ftp', 'smtp']
    }
  },
  'privilege_escalation': {
    frequency: 0.08,
    severity: 'high',
    description: 'Privilege escalation attempt detected',
    mitre: ['T1055', 'T1078', 'T1548'],
    fields: {
      escalation_method: ['token_manipulation', 'process_injection', 'service_manipulation', 'registry_modification'],
      target_privilege: ['administrator', 'system', 'domain_admin', 'local_admin']
    }
  },
  'persistence_mechanism': {
    frequency: 0.07,
    severity: 'high',
    description: 'Persistence mechanism detected',
    mitre: ['T1543', 'T1055', 'T1547'],
    fields: {
      persistence_type: ['service', 'scheduled_task', 'registry_run_key', 'startup_folder', 'wmi_event'],
      location: ['HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run', 'C:\\Users\\%USERNAME%\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup']
    }
  }
};

// Generate realistic timestamp
function generateTimestamp() {
  const now = new Date();
  const randomMinutes = Math.floor(Math.random() * 60);
  const randomSeconds = Math.floor(Math.random() * 60);
  return new Date(now.getTime() - (randomMinutes * 60 * 1000) - (randomSeconds * 1000)).toISOString();
}

// Generate random element from array
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate random number between min and max
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate realistic event based on type
function generateEvent(eventType, config) {
  const timestamp = generateTimestamp();
  const asset = randomChoice(ASSETS.endpoints);
  const user = randomChoice(ASSETS.users);
  const sourceIp = randomChoice(ASSETS.ips);
  const destIp = randomChoice([...ASSETS.ips, ...ASSETS.externalIps]);
  
  const baseEvent = {
    '@timestamp': timestamp,
    event_type: eventType,
    severity: config.severity,
    description: config.description,
    source: {
      asset: asset,
      user: user,
      ip: sourceIp,
      domain: randomChoice(ASSETS.domains)
    },
    destination: {
      ip: destIp,
      port: randomBetween(1, 65535)
    },
    mitre_techniques: config.mitre.map(tech => ({
      id: tech,
      name: MITRE_TECHNIQUES[tech]
    })),
    confidence: randomBetween(60, 95),
    risk_score: randomBetween(1, 100),
    tags: ['cisco-xdr', 'security-event', config.severity],
    raw_log: `[${timestamp}] ${eventType.toUpperCase()}: ${config.description} on ${asset} by ${user}`
  };

  // Add type-specific fields
  if (config.fields) {
    Object.keys(config.fields).forEach(field => {
      baseEvent[field] = randomChoice(config.fields[field]);
    });
  }

  // Add additional context based on event type
  switch (eventType) {
    case 'malware_detected':
      baseEvent.malware = {
        name: baseEvent.malware_name,
        file_path: baseEvent.file_path + baseEvent.file_name,
        hash: generateRandomHash(),
        signature: randomChoice(['detected', 'quarantined', 'blocked'])
      };
      break;
      
    case 'network_anomaly':
      baseEvent.network = {
        protocol: baseEvent.protocol,
        port: baseEvent.port,
        direction: baseEvent.direction,
        bytes_transferred: randomBetween(1024, 10485760), // 1KB to 10MB
        packets: randomBetween(10, 1000)
      };
      break;
      
    case 'authentication_failure':
      baseEvent.auth = {
        method: baseEvent.auth_method,
        failure_reason: baseEvent.failure_reason,
        attempts: randomBetween(1, 10),
        account: user
      };
      break;
      
    case 'lateral_movement':
      baseEvent.lateral_movement = {
        type: baseEvent.movement_type,
        target_system: baseEvent.target_system,
        success: randomChoice([true, false]),
        credentials_used: randomChoice([true, false])
      };
      break;
      
    case 'data_exfiltration':
      baseEvent.exfiltration = {
        data_type: baseEvent.data_type,
        method: baseEvent.exfiltration_method,
        volume: randomBetween(1024, 104857600), // 1KB to 100MB
        destination: destIp
      };
      break;
  }

  return baseEvent;
}

// Generate random hash
function generateRandomHash() {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Generate batch of events
function generateEventBatch(count = 100) {
  const events = [];
  const eventTypes = Object.keys(EVENT_TYPES);
  
  for (let i = 0; i < count; i++) {
    // Weighted random selection based on frequency
    const rand = Math.random();
    let cumulative = 0;
    let selectedType = eventTypes[0];
    
    for (const type of eventTypes) {
      cumulative += EVENT_TYPES[type].frequency;
      if (rand <= cumulative) {
        selectedType = type;
        break;
      }
    }
    
    const event = generateEvent(selectedType, EVENT_TYPES[selectedType]);
    events.push(event);
  }
  
  return events;
}

// Create index mapping
async function createIndexMapping() {
  try {
    const mapping = {
      mappings: {
        properties: {
          '@timestamp': { type: 'date' },
          event_type: { type: 'keyword' },
          severity: { type: 'keyword' },
          description: { type: 'text' },
          source: {
            properties: {
              asset: { type: 'keyword' },
              user: { type: 'keyword' },
              ip: { type: 'ip' },
              domain: { type: 'keyword' }
            }
          },
          destination: {
            properties: {
              ip: { type: 'ip' },
              port: { type: 'integer' }
            }
          },
          mitre_techniques: {
            properties: {
              id: { type: 'keyword' },
              name: { type: 'text' }
            }
          },
          confidence: { type: 'integer' },
          risk_score: { type: 'integer' },
          tags: { type: 'keyword' },
          raw_log: { type: 'text' },
          malware: {
            properties: {
              name: { type: 'keyword' },
              file_path: { type: 'keyword' },
              hash: { type: 'keyword' },
              signature: { type: 'keyword' }
            }
          },
          network: {
            properties: {
              protocol: { type: 'keyword' },
              port: { type: 'integer' },
              direction: { type: 'keyword' },
              bytes_transferred: { type: 'long' },
              packets: { type: 'integer' }
            }
          },
          auth: {
            properties: {
              method: { type: 'keyword' },
              failure_reason: { type: 'keyword' },
              attempts: { type: 'integer' },
              account: { type: 'keyword' }
            }
          },
          lateral_movement: {
            properties: {
              type: { type: 'keyword' },
              target_system: { type: 'keyword' },
              success: { type: 'boolean' },
              credentials_used: { type: 'boolean' }
            }
          },
          exfiltration: {
            properties: {
              data_type: { type: 'keyword' },
              method: { type: 'keyword' },
              volume: { type: 'long' },
              destination: { type: 'ip' }
            }
          }
        }
      }
    };

    // Check if index exists
    const exists = await client.indices.exists({ index: INDEX_NAME });
    
    if (!exists) {
      await client.indices.create({
        index: INDEX_NAME,
        body: mapping
      });
      console.log(`✅ Created index: ${INDEX_NAME}`);
    } else {
      console.log(`ℹ️  Index already exists: ${INDEX_NAME}`);
    }
  } catch (error) {
    console.error('❌ Error creating index mapping:', error.message);
  }
}

// Index events to Elasticsearch
async function indexEvents(events) {
  try {
    const body = [];
    
    for (const event of events) {
      body.push({ index: { _index: INDEX_NAME } });
      body.push(event);
    }
    
    const response = await client.bulk({ body });
    
    if (response.errors) {
      console.error('❌ Some events failed to index');
      response.items.forEach((item, index) => {
        if (item.index.error) {
          console.error(`Event ${index}:`, item.index.error);
        }
      });
    } else {
      console.log(`✅ Successfully indexed ${events.length} events to ${INDEX_NAME}`);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error indexing events:', error.message);
    throw error;
  }
}

// Main simulation function
async function runSimulation(options = {}) {
  const {
    eventCount = 1000,
    batchSize = 100,
    continuous = false,
    interval = 5000 // 5 seconds
  } = options;

  console.log('🚀 Starting Cisco XDR Log Simulation');
  console.log(`📊 Target: ${eventCount} events`);
  console.log(`📦 Batch size: ${batchSize}`);
  console.log(`🔄 Continuous: ${continuous}`);
  console.log(`⏱️  Interval: ${interval}ms`);
  console.log('=' .repeat(50));

  try {
    // Create index mapping
    await createIndexMapping();
    
    if (continuous) {
      console.log('🔄 Starting continuous simulation...');
      let totalIndexed = 0;
      
      while (true) {
        const batch = generateEventBatch(batchSize);
        await indexEvents(batch);
        totalIndexed += batch.length;
        console.log(`📈 Total indexed: ${totalIndexed} events`);
        
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    } else {
      console.log('📝 Generating events...');
      const allEvents = generateEventBatch(eventCount);
      
      // Index in batches
      for (let i = 0; i < allEvents.length; i += batchSize) {
        const batch = allEvents.slice(i, i + batchSize);
        await indexEvents(batch);
        console.log(`📦 Indexed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allEvents.length / batchSize)}`);
      }
      
      console.log('✅ Simulation completed!');
    }
  } catch (error) {
    console.error('❌ Simulation failed:', error.message);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--count':
        options.eventCount = parseInt(args[++i]);
        break;
      case '--batch-size':
        options.batchSize = parseInt(args[++i]);
        break;
      case '--continuous':
        options.continuous = true;
        break;
      case '--interval':
        options.interval = parseInt(args[++i]);
        break;
      case '--help':
        console.log(`
Cisco XDR Log Simulator

Usage: node cisco-xdr-log-simulator.js [options]

Options:
  --count <number>      Number of events to generate (default: 1000)
  --batch-size <number> Batch size for indexing (default: 100)
  --continuous          Run continuously (default: false)
  --interval <number>   Interval between batches in ms (default: 5000)
  --help               Show this help message

Examples:
  node cisco-xdr-log-simulator.js --count 5000
  node cisco-xdr-log-simulator.js --continuous --interval 10000
  node cisco-xdr-log-simulator.js --count 1000 --batch-size 50
        `);
        process.exit(0);
    }
  }
  
  runSimulation(options);
}

module.exports = {
  generateEvent,
  generateEventBatch,
  runSimulation,
  createIndexMapping,
  indexEvents
};
