#!/usr/bin/env node

/**
 * Cisco XDR + Elastic Demo Runner
 * Orchestrates the complete demo including log simulation and AI analysis
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if .env file exists
function checkEnvironment() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    colorLog('yellow', '⚠️  .env file not found. Creating from template...');
    const envExamplePath = path.join(__dirname, '..', 'env.example');
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      colorLog('green', '✅ Created .env file from template');
      colorLog('yellow', '📝 Please update .env with your actual credentials');
    } else {
      colorLog('red', '❌ env.example file not found');
      process.exit(1);
    }
  }
}

// Run a script and return a promise
function runScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    colorLog('blue', `🚀 Running: node ${scriptPath} ${args.join(' ')}`);
    
    const child = spawn('node', [scriptPath, ...args], {
      stdio: 'inherit',
      cwd: path.dirname(scriptPath)
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        colorLog('green', `✅ ${scriptPath} completed successfully`);
        resolve();
      } else {
        colorLog('red', `❌ ${scriptPath} failed with code ${code}`);
        reject(new Error(`Script failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      colorLog('red', `❌ Error running ${scriptPath}: ${error.message}`);
      reject(error);
    });
  });
}

// Main demo function
async function runDemo() {
  colorLog('cyan', '🎯 Cisco XDR + Elastic Demo');
  colorLog('cyan', '=' .repeat(50));
  
  try {
    // Check environment
    checkEnvironment();
    
    // Step 1: Test Elastic 1Chat connection
    colorLog('yellow', '\n1️⃣ Testing Elastic 1Chat connection...');
    await runScript(path.join(__dirname, 'elastic-1chat-integration.js'), ['--tools']);
    
    // Step 2: Generate and index sample logs
    colorLog('yellow', '\n2️⃣ Generating Cisco XDR sample logs...');
    await runScript(path.join(__dirname, 'cisco-xdr-log-simulator.js'), ['--count', '1000', '--batch-size', '100']);
    
    // Step 3: Run Elastic 1Chat analysis
    colorLog('yellow', '\n3️⃣ Running Elastic 1Chat analysis...');
    await runScript(path.join(__dirname, 'elastic-1chat-integration.js'), ['--demo']);
    
    // Step 4: Generate additional analysis
    colorLog('yellow', '\n4️⃣ Generating threat hunting queries...');
    await runScript(path.join(__dirname, 'elastic-1chat-integration.js'), ['--query', 'APT']);
    
    colorLog('yellow', '\n5️⃣ Creating incident response playbook...');
    await runScript(path.join(__dirname, 'elastic-1chat-integration.js'), ['--playbook', 'Ransomware']);
    
    colorLog('green', '\n🎉 Demo completed successfully!');
    colorLog('cyan', '\n📋 Next Steps:');
    colorLog('cyan', '1. Start the frontend: cd frontend && npm run dev');
    colorLog('cyan', '2. Start the backend: cd backend && npm run dev');
    colorLog('cyan', '3. Open http://localhost:3000 to view the demo');
    colorLog('cyan', '4. Check your Elastic Cloud instance for the indexed data');
    
  } catch (error) {
    colorLog('red', `\n❌ Demo failed: ${error.message}`);
    process.exit(1);
  }
}

// Interactive menu
async function showMenu() {
  console.clear();
  colorLog('cyan', '🎯 Cisco XDR + Elastic Demo Menu');
  colorLog('cyan', '=' .repeat(40));
  console.log('1. Run complete demo');
  console.log('2. Test Elastic 1Chat connection');
  console.log('3. Generate sample logs only');
  console.log('4. Run Elastic 1Chat analysis only');
  console.log('5. Generate threat hunting query');
  console.log('6. Create incident response playbook');
  console.log('7. Start continuous log simulation');
  console.log('8. Exit');
  console.log('');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('Select an option (1-8): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Handle menu selection
async function handleMenuSelection(choice) {
  const scriptsDir = __dirname;
  
  switch (choice) {
    case '1':
      await runDemo();
      break;
      
    case '2':
      colorLog('yellow', '🔍 Testing Elastic 1Chat connection...');
      await runScript(path.join(scriptsDir, 'elastic-1chat-integration.js'), ['--tools']);
      break;
      
    case '3':
      colorLog('yellow', '📝 Generating sample logs...');
      await runScript(path.join(scriptsDir, 'cisco-xdr-log-simulator.js'), ['--count', '1000']);
      break;
      
    case '4':
      colorLog('yellow', '🤖 Running Elastic 1Chat analysis...');
      await runScript(path.join(scriptsDir, 'elastic-1chat-integration.js'), ['--demo']);
      break;
      
    case '5':
      colorLog('yellow', '🎯 Generating threat hunting query...');
      await runScript(path.join(scriptsDir, 'elastic-1chat-integration.js'), ['--query', 'APT']);
      break;
      
    case '6':
      colorLog('yellow', '📋 Creating incident response playbook...');
      await runScript(path.join(scriptsDir, 'elastic-1chat-integration.js'), ['--playbook', 'Ransomware']);
      break;
      
    case '7':
      colorLog('yellow', '🔄 Starting continuous log simulation...');
      colorLog('cyan', 'Press Ctrl+C to stop');
      await runScript(path.join(scriptsDir, 'cisco-xdr-log-simulator.js'), ['--continuous', '--interval', '5000']);
      break;
      
    case '8':
      colorLog('green', '👋 Goodbye!');
      process.exit(0);
      break;
      
    default:
      colorLog('red', '❌ Invalid option. Please select 1-8.');
      break;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
Cisco XDR + Elastic Demo Runner

Usage: node run-demo.js [options]

Options:
  --menu                 Show interactive menu (default)
  --demo                 Run complete demo
  --test                 Test Elastic 1Chat connection only
  --logs                 Generate sample logs only
  --analysis             Run Elastic 1Chat analysis only
  --query <threat>       Generate threat hunting query
  --playbook <type>      Create incident response playbook
  --continuous           Start continuous log simulation
  --help                 Show this help message

Examples:
  node run-demo.js --demo
  node run-demo.js --test
  node run-demo.js --logs
  node run-demo.js --query APT
  node run-demo.js --playbook Ransomware
    `);
    process.exit(0);
  }
  
  if (args.includes('--demo')) {
    await runDemo();
  } else if (args.includes('--test')) {
    await runScript(path.join(__dirname, 'elastic-1chat-integration.js'), ['--tools']);
  } else if (args.includes('--logs')) {
    await runScript(path.join(__dirname, 'cisco-xdr-log-simulator.js'), ['--count', '1000']);
  } else if (args.includes('--analysis')) {
    await runScript(path.join(__dirname, 'elastic-1chat-integration.js'), ['--demo']);
  } else if (args.includes('--query')) {
    const threat = args[args.indexOf('--query') + 1] || 'APT';
    await runScript(path.join(__dirname, 'elastic-1chat-integration.js'), ['--query', threat]);
  } else if (args.includes('--playbook')) {
    const type = args[args.indexOf('--playbook') + 1] || 'Ransomware';
    await runScript(path.join(__dirname, 'elastic-1chat-integration.js'), ['--playbook', type]);
  } else if (args.includes('--continuous')) {
    await runScript(path.join(__dirname, 'cisco-xdr-log-simulator.js'), ['--continuous', '--interval', '5000']);
  } else {
    // Interactive menu
    while (true) {
      const choice = await showMenu();
      await handleMenuSelection(choice);
      
      if (choice !== '8') {
        console.log('\nPress Enter to continue...');
        await new Promise(resolve => {
          const readline = require('readline');
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          rl.question('', () => {
            rl.close();
            resolve();
          });
        });
      }
    }
  }
}

// Handle process termination
process.on('SIGINT', () => {
  colorLog('yellow', '\n\n👋 Demo interrupted. Goodbye!');
  process.exit(0);
});

// Run main function
if (require.main === module) {
  main().catch(error => {
    colorLog('red', `❌ Error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  runDemo,
  runScript,
  checkEnvironment
};
