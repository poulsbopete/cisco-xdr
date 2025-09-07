const express = require('express');
const router = express.Router();
const { searchDocuments, indexDocument } = require('../config/elastic');
const logger = require('../config/logger');

// Mock alerts data
const mockAlerts = [
  {
    id: '1',
    title: 'Suspicious PowerShell Execution',
    description: 'PowerShell script with obfuscated commands detected on endpoint',
    severity: 'high',
    confidence: 87,
    source: 'Cisco XDR',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'new',
    category: 'Malware',
    mitreTags: ['T1055', 'T1027'],
    affectedAssets: ['Endpoint-042', 'Workstation-156'],
    aiRecommendation: 'High confidence - investigate immediately. Check for lateral movement indicators.',
    autoCloseable: false
  },
  {
    id: '2',
    title: 'Unusual Network Traffic Pattern',
    description: 'Large volume of data transfer to external IP address',
    severity: 'medium',
    confidence: 65,
    source: 'Elastic SIEM',
    timestamp: '2024-01-15T10:25:00Z',
    status: 'new',
    category: 'Data Exfiltration',
    mitreTags: ['T1041', 'T1071'],
    affectedAssets: ['File-Server-003'],
    aiRecommendation: 'Medium confidence - verify if this is legitimate business activity.',
    autoCloseable: true
  },
  {
    id: '3',
    title: 'Failed Login Attempts',
    description: 'Multiple failed login attempts from external IP',
    severity: 'low',
    confidence: 45,
    source: 'Cisco XDR',
    timestamp: '2024-01-15T10:20:00Z',
    status: 'new',
    category: 'Brute Force',
    mitreTags: ['T1110'],
    affectedAssets: ['VPN-Gateway'],
    aiRecommendation: 'Low confidence - likely automated scanning. Consider auto-closing.',
    autoCloseable: true
  },
  {
    id: '4',
    title: 'Ransomware File Encryption',
    description: 'Multiple files encrypted with .ryuk extension detected',
    severity: 'critical',
    confidence: 98,
    source: 'Cisco XDR',
    timestamp: '2024-01-15T10:15:00Z',
    status: 'investigating',
    category: 'Ransomware',
    mitreTags: ['T1486', 'T1055'],
    affectedAssets: ['Endpoint-156', 'File-Server-003'],
    aiRecommendation: 'Critical - immediate response required. Isolate affected systems.',
    autoCloseable: false
  }
];

// Get all alerts with filtering
router.get('/alerts', async (req, res) => {
  try {
    const { 
      search, 
      severity, 
      status, 
      category, 
      limit = 50, 
      offset = 0 
    } = req.query;
    
    let filteredAlerts = [...mockAlerts];
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.title.toLowerCase().includes(searchLower) ||
        alert.description.toLowerCase().includes(searchLower) ||
        alert.affectedAssets.some(asset => asset.toLowerCase().includes(searchLower))
      );
    }
    
    if (severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
    }
    
    if (status) {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
    }
    
    if (category) {
      filteredAlerts = filteredAlerts.filter(alert => alert.category === category);
    }
    
    // Pagination
    const paginatedAlerts = filteredAlerts.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedAlerts,
      total: filteredAlerts.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts'
    });
  }
});

// Get alert statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      total: mockAlerts.length,
      new: mockAlerts.filter(a => a.status === 'new').length,
      triaged: mockAlerts.filter(a => a.status === 'triaged').length,
      investigating: mockAlerts.filter(a => a.status === 'investigating').length,
      resolved: mockAlerts.filter(a => a.status === 'resolved').length,
      falsePositive: mockAlerts.filter(a => a.status === 'false_positive').length,
      autoClosed: 12, // Mock number
      bySeverity: {
        critical: mockAlerts.filter(a => a.severity === 'critical').length,
        high: mockAlerts.filter(a => a.severity === 'high').length,
        medium: mockAlerts.filter(a => a.severity === 'medium').length,
        low: mockAlerts.filter(a => a.severity === 'low').length
      },
      byCategory: mockAlerts.reduce((acc, alert) => {
        acc[alert.category] = (acc[alert.category] || 0) + 1;
        return acc;
      }, {})
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error fetching alert stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alert stats'
    });
  }
});

// Update alert status
router.put('/alerts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const alert = mockAlerts.find(a => a.id === id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }
    
    alert.status = status;
    alert.updatedAt = new Date().toISOString();
    if (notes) {
      alert.notes = notes;
    }
    
    // Update in Elastic
    if (process.env.MOCK_DATA_ENABLED !== 'true') {
      await indexDocument('alerts', alert, id);
    }
    
    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    logger.error('Error updating alert status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update alert status'
    });
  }
});

// Bulk update alerts
router.put('/alerts/bulk', async (req, res) => {
  try {
    const { alertIds, status, notes } = req.body;
    
    const updatedAlerts = [];
    
    for (const id of alertIds) {
      const alert = mockAlerts.find(a => a.id === id);
      if (alert) {
        alert.status = status;
        alert.updatedAt = new Date().toISOString();
        if (notes) {
          alert.notes = notes;
        }
        updatedAlerts.push(alert);
        
        // Update in Elastic
        if (process.env.MOCK_DATA_ENABLED !== 'true') {
          await indexDocument('alerts', alert, id);
        }
      }
    }
    
    res.json({
      success: true,
      data: updatedAlerts,
      count: updatedAlerts.length
    });
  } catch (error) {
    logger.error('Error bulk updating alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk update alerts'
    });
  }
});

// Run auto-triage
router.post('/auto-triage', async (req, res) => {
  try {
    const { enabled, confidenceThreshold = 60 } = req.body;
    
    logger.info('Running auto-triage with threshold:', confidenceThreshold);
    
    // Simulate auto-triage process
    const autoTriageResults = {
      processed: 0,
      autoClosed: 0,
      escalated: 0,
      errors: 0,
      details: []
    };
    
    // Process alerts that can be auto-closed
    const autoCloseableAlerts = mockAlerts.filter(alert => 
      alert.autoCloseable && 
      alert.confidence < confidenceThreshold && 
      alert.status === 'new'
    );
    
    for (const alert of autoCloseableAlerts) {
      alert.status = 'false_positive';
      alert.autoClosedAt = new Date().toISOString();
      alert.autoCloseReason = `Auto-closed due to low confidence (${alert.confidence}%)`;
      
      autoTriageResults.processed++;
      autoTriageResults.autoClosed++;
      autoTriageResults.details.push({
        alertId: alert.id,
        action: 'auto-closed',
        reason: alert.autoCloseReason
      });
    }
    
    // Escalate high-confidence alerts
    const highConfidenceAlerts = mockAlerts.filter(alert => 
      alert.confidence >= 80 && 
      alert.status === 'new'
    );
    
    for (const alert of highConfidenceAlerts) {
      alert.status = 'investigating';
      alert.escalatedAt = new Date().toISOString();
      alert.escalationReason = `High confidence alert (${alert.confidence}%)`;
      
      autoTriageResults.processed++;
      autoTriageResults.escalated++;
      autoTriageResults.details.push({
        alertId: alert.id,
        action: 'escalated',
        reason: alert.escalationReason
      });
    }
    
    res.json({
      success: true,
      data: autoTriageResults
    });
  } catch (error) {
    logger.error('Error running auto-triage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run auto-triage'
    });
  }
});

// Get auto-triage configuration
router.get('/auto-triage/config', async (req, res) => {
  try {
    const config = {
      enabled: true,
      confidenceThreshold: 60,
      autoCloseCategories: ['Brute Force', 'Scanning'],
      escalationThreshold: 80,
      escalationCategories: ['Ransomware', 'Malware', 'Data Exfiltration'],
      rules: [
        {
          id: '1',
          name: 'Auto-close low confidence brute force',
          condition: 'category = "Brute Force" AND confidence < 50',
          action: 'auto_close',
          enabled: true
        },
        {
          id: '2',
          name: 'Escalate high confidence ransomware',
          condition: 'category = "Ransomware" AND confidence > 80',
          action: 'escalate',
          enabled: true
        }
      ]
    };
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    logger.error('Error fetching auto-triage config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch auto-triage config'
    });
  }
});

module.exports = router;
