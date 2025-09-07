const express = require('express');
const router = express.Router();
const { searchDocuments, indexDocument } = require('../config/elastic');
const logger = require('../config/logger');

// Mock data for demo
const mockThreatStories = [
  {
    id: '1',
    title: 'APT Campaign: Financial Sector Targeting',
    description: 'Multi-stage attack targeting banking infrastructure with sophisticated evasion techniques',
    severity: 'critical',
    confidence: 94,
    status: 'investigating',
    createdAt: '2024-01-15T10:30:00Z',
    mitreTags: ['T1055', 'T1071', 'T1027', 'T1566'],
    summary: 'AI agents identified a coordinated APT campaign targeting financial institutions. The attack involves credential harvesting, lateral movement, and data exfiltration attempts. Multiple indicators suggest state-sponsored activity.',
    timeline: [
      {
        id: '1-1',
        timestamp: '2024-01-15T09:15:00Z',
        event: 'Suspicious PowerShell execution detected',
        source: 'Endpoint-042',
        details: 'PowerShell script with obfuscated commands executed from temp directory',
        severity: 'medium'
      },
      {
        id: '1-2',
        timestamp: '2024-01-15T09:22:00Z',
        event: 'Network beacon to external IP',
        source: 'Network-001',
        details: 'Outbound connection to suspicious IP address in Eastern Europe',
        severity: 'high'
      },
      {
        id: '1-3',
        timestamp: '2024-01-15T09:45:00Z',
        event: 'Lateral movement attempt',
        source: 'Endpoint-042',
        details: 'Attempted SMB connection to multiple internal servers',
        severity: 'critical'
      },
      {
        id: '1-4',
        timestamp: '2024-01-15T10:15:00Z',
        event: 'Data exfiltration detected',
        source: 'File-Server-003',
        details: 'Large volume of sensitive files accessed and copied',
        severity: 'critical'
      }
    ]
  },
  {
    id: '2',
    title: 'Ransomware Campaign: Ryuk Variant',
    description: 'Automated detection of Ryuk ransomware deployment across multiple endpoints',
    severity: 'critical',
    confidence: 98,
    status: 'active',
    createdAt: '2024-01-15T08:45:00Z',
    mitreTags: ['T1486', 'T1055', 'T1027', 'T1070'],
    summary: 'AI agents detected the deployment of Ryuk ransomware across the network. The attack appears to have been initiated through a phishing campaign and has already encrypted several critical systems.',
    timeline: [
      {
        id: '2-1',
        timestamp: '2024-01-15T08:30:00Z',
        event: 'Malicious email attachment opened',
        source: 'Endpoint-156',
        details: 'User opened suspicious PDF attachment from external sender',
        severity: 'medium'
      },
      {
        id: '2-2',
        timestamp: '2024-01-15T08:35:00Z',
        event: 'Malware execution detected',
        source: 'Endpoint-156',
        details: 'Ryuk ransomware executable launched from temp directory',
        severity: 'critical'
      },
      {
        id: '2-3',
        timestamp: '2024-01-15T08:42:00Z',
        event: 'Network propagation',
        source: 'Network-001',
        details: 'Ransomware spreading to additional endpoints via SMB',
        severity: 'critical'
      }
    ]
  }
];

// Get all threat stories
router.get('/stories', async (req, res) => {
  try {
    const { search, severity, status } = req.query;
    
    let stories = [...mockThreatStories];
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      stories = stories.filter(story => 
        story.title.toLowerCase().includes(searchLower) ||
        story.description.toLowerCase().includes(searchLower) ||
        story.mitreTags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (severity) {
      stories = stories.filter(story => story.severity === severity);
    }
    
    if (status) {
      stories = stories.filter(story => story.status === status);
    }
    
    res.json({
      success: true,
      data: stories,
      total: stories.length
    });
  } catch (error) {
    logger.error('Error fetching threat stories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch threat stories'
    });
  }
});

// Get specific threat story
router.get('/stories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const story = mockThreatStories.find(s => s.id === id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        error: 'Threat story not found'
      });
    }
    
    res.json({
      success: true,
      data: story
    });
  } catch (error) {
    logger.error('Error fetching threat story:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch threat story'
    });
  }
});

// Start threat hunting
router.post('/hunt', async (req, res) => {
  try {
    const { query, timeRange, severity } = req.body;
    
    // Simulate hunting process
    logger.info('Starting threat hunt with query:', query);
    
    // In a real implementation, this would:
    // 1. Query Elastic for alerts and events
    // 2. Use AI to correlate and analyze
    // 3. Generate threat stories
    // 4. Store results in Elastic
    
    const huntResult = {
      id: Date.now().toString(),
      status: 'completed',
      query,
      timeRange,
      severity,
      storiesFound: Math.floor(Math.random() * 5) + 1,
      confidence: Math.floor(Math.random() * 20) + 80,
      createdAt: new Date().toISOString()
    };
    
    // Store hunt result in Elastic
    if (process.env.MOCK_DATA_ENABLED !== 'true') {
      await indexDocument('threat-hunts', huntResult);
    }
    
    res.json({
      success: true,
      data: huntResult
    });
  } catch (error) {
    logger.error('Error starting threat hunt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start threat hunt'
    });
  }
});

// Get hunt history
router.get('/hunts', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    // Mock hunt history
    const huntHistory = Array.from({ length: 10 }, (_, i) => ({
      id: (i + 1).toString(),
      query: `Threat hunt ${i + 1}`,
      status: ['completed', 'running', 'failed'][Math.floor(Math.random() * 3)],
      storiesFound: Math.floor(Math.random() * 5) + 1,
      confidence: Math.floor(Math.random() * 20) + 80,
      createdAt: new Date(Date.now() - i * 3600000).toISOString()
    }));
    
    res.json({
      success: true,
      data: huntHistory.slice(offset, offset + limit),
      total: huntHistory.length
    });
  } catch (error) {
    logger.error('Error fetching hunt history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hunt history'
    });
  }
});

// Update threat story status
router.put('/stories/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const story = mockThreatStories.find(s => s.id === id);
    if (!story) {
      return res.status(404).json({
        success: false,
        error: 'Threat story not found'
      });
    }
    
    story.status = status;
    story.updatedAt = new Date().toISOString();
    
    // Update in Elastic
    if (process.env.MOCK_DATA_ENABLED !== 'true') {
      await indexDocument('threat-stories', story, id);
    }
    
    res.json({
      success: true,
      data: story
    });
  } catch (error) {
    logger.error('Error updating threat story status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update threat story status'
    });
  }
});

module.exports = router;
