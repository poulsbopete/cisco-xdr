const express = require('express');
const router = express.Router();
const { searchDocuments, indexDocument } = require('../config/elastic');
const logger = require('../config/logger');

// Mock playbooks data
const mockPlaybooks = [
  {
    id: '1',
    title: 'Ransomware Response Playbook',
    description: 'Step-by-step guide for responding to ransomware attacks',
    category: 'Incident Response',
    steps: [
      'Immediately isolate affected systems',
      'Assess the scope of the attack',
      'Preserve evidence for forensic analysis',
      'Contact law enforcement and cyber insurance',
      'Restore from clean backups',
      'Implement additional security controls'
    ],
    mitreTags: ['T1486', 'T1055', 'T1027'],
    lastUpdated: '2024-01-10T00:00:00Z',
    relevance: 95
  },
  {
    id: '2',
    title: 'APT Investigation Playbook',
    description: 'Comprehensive guide for investigating advanced persistent threats',
    category: 'Threat Hunting',
    steps: [
      'Identify initial compromise vector',
      'Map lateral movement paths',
      'Analyze data exfiltration attempts',
      'Document attack timeline',
      'Implement containment measures',
      'Conduct post-incident review'
    ],
    mitreTags: ['T1055', 'T1071', 'T1027', 'T1566'],
    lastUpdated: '2024-01-08T00:00:00Z',
    relevance: 88
  },
  {
    id: '3',
    title: 'Phishing Campaign Response',
    description: 'Response procedures for phishing campaigns',
    category: 'Email Security',
    steps: [
      'Identify affected users',
      'Quarantine malicious emails',
      'Reset compromised credentials',
      'Scan affected endpoints',
      'Educate users about the threat',
      'Update email security rules'
    ],
    mitreTags: ['T1566', 'T1204', 'T1055'],
    lastUpdated: '2024-01-05T00:00:00Z',
    relevance: 72
  }
];

// Mock past incidents data
const mockIncidents = [
  {
    id: '1',
    title: 'Ryuk Ransomware Attack - Q4 2023',
    description: 'Successful containment of Ryuk ransomware affecting 15 endpoints',
    severity: 'critical',
    resolution: 'Isolated affected systems, restored from backups, implemented additional monitoring',
    lessonsLearned: [
      'Need better email security filtering',
      'Backup verification procedures need improvement',
      'User training on phishing identification required'
    ],
    mitreTags: ['T1486', 'T1055', 'T1027'],
    date: '2023-12-15T00:00:00Z',
    relevance: 92
  },
  {
    id: '2',
    title: 'APT Campaign - Financial Sector',
    description: 'Multi-stage APT attack targeting financial data',
    severity: 'high',
    resolution: 'Detected early, contained lateral movement, prevented data exfiltration',
    lessonsLearned: [
      'Network segmentation was effective',
      'Behavioral analytics caught the attack early',
      'Regular security assessments are crucial'
    ],
    mitreTags: ['T1055', 'T1071', 'T1027', 'T1566'],
    date: '2023-11-20T00:00:00Z',
    relevance: 85
  },
  {
    id: '3',
    title: 'Insider Threat Investigation',
    description: 'Employee attempting to exfiltrate customer data',
    severity: 'medium',
    resolution: 'Identified through DLP alerts, terminated employee, legal action taken',
    lessonsLearned: [
      'DLP systems are essential for data protection',
      'Regular access reviews help identify anomalies',
      'Clear policies and monitoring deter insider threats'
    ],
    mitreTags: ['T1071', 'T1041', 'T1055'],
    date: '2023-10-08T00:00:00Z',
    relevance: 68
  }
];

// Chat with AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Simulate AI response generation
    const response = generateAIResponse(message, context);
    
    // Store conversation in Elastic
    const conversation = {
      userMessage: message,
      aiResponse: response.content,
      context,
      timestamp: new Date().toISOString(),
      sources: response.sources || []
    };
    
    if (process.env.MOCK_DATA_ENABLED !== 'true') {
      await indexDocument('ai-conversations', conversation);
    }
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    logger.error('Error processing chat message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message'
    });
  }
});

// Get playbooks
router.get('/playbooks', async (req, res) => {
  try {
    const { search, category, limit = 50, offset = 0 } = req.query;
    
    let filteredPlaybooks = [...mockPlaybooks];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPlaybooks = filteredPlaybooks.filter(playbook => 
        playbook.title.toLowerCase().includes(searchLower) ||
        playbook.description.toLowerCase().includes(searchLower) ||
        playbook.steps.some(step => step.toLowerCase().includes(searchLower))
      );
    }
    
    if (category) {
      filteredPlaybooks = filteredPlaybooks.filter(playbook => playbook.category === category);
    }
    
    // Sort by relevance
    filteredPlaybooks.sort((a, b) => b.relevance - a.relevance);
    
    const paginatedPlaybooks = filteredPlaybooks.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedPlaybooks,
      total: filteredPlaybooks.length
    });
  } catch (error) {
    logger.error('Error fetching playbooks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch playbooks'
    });
  }
});

// Get past incidents
router.get('/incidents', async (req, res) => {
  try {
    const { search, severity, limit = 50, offset = 0 } = req.query;
    
    let filteredIncidents = [...mockIncidents];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredIncidents = filteredIncidents.filter(incident => 
        incident.title.toLowerCase().includes(searchLower) ||
        incident.description.toLowerCase().includes(searchLower) ||
        incident.lessonsLearned.some(lesson => lesson.toLowerCase().includes(searchLower))
      );
    }
    
    if (severity) {
      filteredIncidents = filteredIncidents.filter(incident => incident.severity === severity);
    }
    
    // Sort by relevance
    filteredIncidents.sort((a, b) => b.relevance - a.relevance);
    
    const paginatedIncidents = filteredIncidents.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedIncidents,
      total: filteredIncidents.length
    });
  } catch (error) {
    logger.error('Error fetching past incidents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch past incidents'
    });
  }
});

// Search knowledge base
router.post('/search', async (req, res) => {
  try {
    const { query, type = 'all' } = req.body;
    
    const results = {
      playbooks: [],
      incidents: [],
      recommendations: []
    };
    
    if (type === 'all' || type === 'playbooks') {
      results.playbooks = mockPlaybooks.filter(playbook => 
        playbook.title.toLowerCase().includes(query.toLowerCase()) ||
        playbook.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (type === 'all' || type === 'incidents') {
      results.incidents = mockIncidents.filter(incident => 
        incident.title.toLowerCase().includes(query.toLowerCase()) ||
        incident.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (type === 'all' || type === 'recommendations') {
      results.recommendations = [
        {
          id: '1',
          title: 'Implement Zero Trust Architecture',
          description: 'Adopt zero trust principles for enhanced security',
          category: 'Architecture',
          relevance: 85
        },
        {
          id: '2',
          title: 'Deploy Advanced Threat Detection',
          description: 'Use AI-powered threat detection for better coverage',
          category: 'Detection',
          relevance: 92
        }
      ];
    }
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    logger.error('Error searching knowledge base:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search knowledge base'
    });
  }
});

// Get conversation history
router.get('/conversations', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    // Mock conversation history
    const conversations = [
      {
        id: '1',
        userMessage: 'How should I respond to a ransomware attack?',
        aiResponse: 'For ransomware attacks, follow our Ransomware Response Playbook...',
        timestamp: '2024-01-15T10:30:00Z',
        sources: ['Ransomware Response Playbook', 'Ryuk Attack Q4 2023']
      },
      {
        id: '2',
        userMessage: 'What are the signs of an APT campaign?',
        aiResponse: 'APT campaigns typically show these indicators...',
        timestamp: '2024-01-15T09:45:00Z',
        sources: ['APT Investigation Playbook', 'APT Campaign - Financial Sector']
      }
    ];
    
    const paginatedConversations = conversations.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedConversations,
      total: conversations.length
    });
  } catch (error) {
    logger.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations'
    });
  }
});

// Helper function to generate AI responses
function generateAIResponse(userInput, context) {
  const input = userInput.toLowerCase();
  
  if (input.includes('ransomware')) {
    return {
      content: 'Based on your query about ransomware, I recommend following our Ransomware Response Playbook. Key steps include immediately isolating affected systems, assessing the scope, and preserving evidence. I found a similar incident from Q4 2023 where we successfully contained a Ryuk ransomware attack affecting 15 endpoints. Would you like me to walk you through the specific steps?',
      sources: ['Ransomware Response Playbook', 'Ryuk Attack Q4 2023'],
      actions: ['View playbook', 'Check similar incidents', 'Get step-by-step guidance']
    };
  } else if (input.includes('apt') || input.includes('advanced persistent threat')) {
    return {
      content: 'For APT investigations, I suggest using our APT Investigation Playbook. This involves identifying the initial compromise vector, mapping lateral movement, and analyzing data exfiltration attempts. I found a relevant case from November 2023 where we detected an APT campaign early and prevented data exfiltration. The key was our behavioral analytics and network segmentation.',
      sources: ['APT Investigation Playbook', 'APT Campaign - Financial Sector'],
      actions: ['View playbook', 'Check similar incidents', 'Get investigation steps']
    };
  } else if (input.includes('phishing')) {
    return {
      content: 'For phishing incidents, follow our Phishing Campaign Response playbook. This includes identifying affected users, quarantining emails, and resetting credentials. I can see from past incidents that user education is crucial - we\'ve had success with regular training sessions on phishing identification.',
      sources: ['Phishing Campaign Response', 'Past phishing incidents'],
      actions: ['View playbook', 'Check user training materials', 'Get response steps']
    };
  } else {
    return {
      content: 'I understand you\'re looking for guidance. Let me search through our playbooks and past incidents to provide you with the most relevant information. Based on your query, I can help you with incident response procedures, threat analysis, or specific security recommendations. What specific aspect would you like me to focus on?',
      sources: [],
      actions: ['Search playbooks', 'Review past incidents', 'Get recommendations']
    };
  }
}

module.exports = router;
