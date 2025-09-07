const express = require('express');
const router = express.Router();
const { searchDocuments, indexDocument } = require('../config/elastic');
const logger = require('../config/logger');

// Mock incidents data
const mockIncidents = [
  {
    id: '1',
    title: 'APT Campaign Investigation',
    description: 'Multi-stage attack targeting financial infrastructure',
    severity: 'critical',
    status: 'investigating',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
    assignedTo: 'Security Team Alpha',
    mitreTags: ['T1055', 'T1071', 'T1027', 'T1566'],
    affectedAssets: ['Endpoint-042', 'File-Server-003', 'Database-001'],
    evidence: [
      {
        id: '1-1',
        type: 'log',
        source: 'Cisco XDR',
        description: 'PowerShell execution logs with obfuscated commands',
        timestamp: '2024-01-15T09:15:00Z',
        relevance: 'high',
        extracted: true
      },
      {
        id: '1-2',
        type: 'network',
        source: 'Network Monitor',
        description: 'Suspicious outbound connections to external IPs',
        timestamp: '2024-01-15T09:22:00Z',
        relevance: 'high',
        extracted: true
      },
      {
        id: '1-3',
        type: 'file',
        source: 'File System',
        description: 'Encrypted files with suspicious extensions',
        timestamp: '2024-01-15T10:15:00Z',
        relevance: 'critical',
        extracted: false
      }
    ],
    timeline: [
      {
        id: '1-1',
        timestamp: '2024-01-15T09:15:00Z',
        event: 'Initial compromise detected',
        source: 'Endpoint-042',
        details: 'PowerShell script execution with obfuscated commands',
        severity: 'high'
      },
      {
        id: '1-2',
        timestamp: '2024-01-15T09:22:00Z',
        event: 'Lateral movement attempt',
        source: 'Network-001',
        details: 'SMB connections to multiple internal servers',
        severity: 'critical'
      },
      {
        id: '1-3',
        timestamp: '2024-01-15T10:15:00Z',
        event: 'Data exfiltration detected',
        source: 'File-Server-003',
        details: 'Large volume of sensitive files accessed',
        severity: 'critical'
      }
    ],
    summary: 'AI agents identified a coordinated APT campaign targeting financial institutions. The attack involves credential harvesting, lateral movement, and data exfiltration attempts. Multiple indicators suggest state-sponsored activity with sophisticated evasion techniques.',
    recommendations: [
      'Immediately isolate affected endpoints',
      'Reset all compromised credentials',
      'Implement additional network monitoring',
      'Conduct forensic analysis on affected systems',
      'Notify relevant stakeholders and authorities'
    ]
  },
  {
    id: '2',
    title: 'Ransomware Attack Response',
    description: 'Ryuk ransomware deployment across multiple endpoints',
    severity: 'critical',
    status: 'active',
    createdAt: '2024-01-15T08:45:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    assignedTo: 'Incident Response Team',
    mitreTags: ['T1486', 'T1055', 'T1027', 'T1070'],
    affectedAssets: ['Endpoint-156', 'File-Server-003', 'Workstation-089'],
    evidence: [
      {
        id: '2-1',
        type: 'file',
        source: 'File System',
        description: 'Files encrypted with .ryuk extension',
        timestamp: '2024-01-15T08:35:00Z',
        relevance: 'critical',
        extracted: true
      },
      {
        id: '2-2',
        type: 'endpoint',
        source: 'Cisco XDR',
        description: 'Malware execution logs and process trees',
        timestamp: '2024-01-15T08:35:00Z',
        relevance: 'high',
        extracted: true
      }
    ],
    timeline: [
      {
        id: '2-1',
        timestamp: '2024-01-15T08:30:00Z',
        event: 'Phishing email opened',
        source: 'Endpoint-156',
        details: 'User opened malicious PDF attachment',
        severity: 'medium'
      },
      {
        id: '2-2',
        timestamp: '2024-01-15T08:35:00Z',
        event: 'Ransomware execution',
        source: 'Endpoint-156',
        details: 'Ryuk ransomware launched and began encryption',
        severity: 'critical'
      },
      {
        id: '2-3',
        timestamp: '2024-01-15T08:42:00Z',
        event: 'Network propagation',
        source: 'Network-001',
        details: 'Ransomware spreading to additional endpoints',
        severity: 'critical'
      }
    ],
    summary: 'Ryuk ransomware has been deployed across multiple endpoints in the network. The attack was initiated through a phishing campaign and has already encrypted several critical systems. Immediate containment and recovery actions are required.',
    recommendations: [
      'Isolate all affected endpoints immediately',
      'Disable network shares to prevent further spread',
      'Assess backup integrity and availability',
      'Contact law enforcement and cyber insurance',
      'Prepare communication plan for stakeholders'
    ]
  }
];

// Get all incidents
router.get('/incidents', async (req, res) => {
  try {
    const { search, severity, status, limit = 50, offset = 0 } = req.query;
    
    let filteredIncidents = [...mockIncidents];
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredIncidents = filteredIncidents.filter(incident => 
        incident.title.toLowerCase().includes(searchLower) ||
        incident.description.toLowerCase().includes(searchLower) ||
        incident.affectedAssets.some(asset => asset.toLowerCase().includes(searchLower))
      );
    }
    
    if (severity) {
      filteredIncidents = filteredIncidents.filter(incident => incident.severity === severity);
    }
    
    if (status) {
      filteredIncidents = filteredIncidents.filter(incident => incident.status === status);
    }
    
    // Pagination
    const paginatedIncidents = filteredIncidents.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedIncidents,
      total: filteredIncidents.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('Error fetching incidents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch incidents'
    });
  }
});

// Get specific incident
router.get('/incidents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const incident = mockIncidents.find(i => i.id === id);
    
    if (!incident) {
      return res.status(404).json({
        success: false,
        error: 'Incident not found'
      });
    }
    
    res.json({
      success: true,
      data: incident
    });
  } catch (error) {
    logger.error('Error fetching incident:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch incident'
    });
  }
});

// Create new incident
router.post('/incidents', async (req, res) => {
  try {
    const { title, description, severity, affectedAssets, evidence } = req.body;
    
    const newIncident = {
      id: Date.now().toString(),
      title,
      description,
      severity,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: 'Unassigned',
      mitreTags: [],
      affectedAssets: affectedAssets || [],
      evidence: evidence || [],
      timeline: [],
      summary: '',
      recommendations: []
    };
    
    // Store in Elastic
    if (process.env.MOCK_DATA_ENABLED !== 'true') {
      await indexDocument('incidents', newIncident);
    }
    
    res.json({
      success: true,
      data: newIncident
    });
  } catch (error) {
    logger.error('Error creating incident:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create incident'
    });
  }
});

// Update incident
router.put('/incidents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const incident = mockIncidents.find(i => i.id === id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        error: 'Incident not found'
      });
    }
    
    const updatedIncident = {
      ...incident,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Update in Elastic
    if (process.env.MOCK_DATA_ENABLED !== 'true') {
      await indexDocument('incidents', updatedIncident, id);
    }
    
    res.json({
      success: true,
      data: updatedIncident
    });
  } catch (error) {
    logger.error('Error updating incident:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update incident'
    });
  }
});

// Generate incident report
router.post('/incidents/:id/generate-report', async (req, res) => {
  try {
    const { id } = req.params;
    const incident = mockIncidents.find(i => i.id === id);
    
    if (!incident) {
      return res.status(404).json({
        success: false,
        error: 'Incident not found'
      });
    }
    
    // Simulate AI-powered report generation
    const report = {
      incidentId: id,
      generatedAt: new Date().toISOString(),
      executiveSummary: `Incident ${incident.title} has been analyzed and documented. The attack involved ${incident.affectedAssets.length} affected assets and ${incident.evidence.length} pieces of evidence.`,
      technicalDetails: {
        attackVector: 'Multi-stage APT campaign',
        impact: 'High - Multiple systems compromised',
        timeline: incident.timeline,
        evidence: incident.evidence
      },
      recommendations: incident.recommendations,
      mitreMapping: incident.mitreTags,
      nextSteps: [
        'Complete forensic analysis',
        'Implement additional security controls',
        'Conduct post-incident review',
        'Update security policies'
      ]
    };
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Error generating incident report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate incident report'
    });
  }
});

module.exports = router;
