const express = require('express');
const router = express.Router();
const { searchDocuments, indexDocument } = require('../config/elastic');
const logger = require('../config/logger');

// Mock automation rules
const mockRules = [
  {
    id: '1',
    name: 'Auto-quarantine Ransomware',
    description: 'Automatically quarantine endpoints when ransomware is detected',
    enabled: true,
    trigger: 'Ransomware detection',
    conditions: ['File encryption detected', 'Ransomware signature match', 'High confidence alert'],
    actions: ['Quarantine endpoint', 'Disable network access', 'Notify security team'],
    lastExecuted: '2024-01-15T10:30:00Z',
    executionCount: 12,
    successRate: 95.8
  },
  {
    id: '2',
    name: 'Block Malicious Domains',
    description: 'Automatically block domains associated with malware campaigns',
    enabled: true,
    trigger: 'Malicious domain detection',
    conditions: ['Domain reputation check', 'Threat intelligence match', 'Multiple alerts'],
    actions: ['Block domain in firewall', 'Update DNS blacklist', 'Log security event'],
    lastExecuted: '2024-01-15T09:45:00Z',
    executionCount: 28,
    successRate: 100
  },
  {
    id: '3',
    name: 'Disable Compromised Accounts',
    description: 'Automatically disable user accounts showing signs of compromise',
    enabled: false,
    trigger: 'Account compromise indicators',
    conditions: ['Unusual login patterns', 'Failed authentication attempts', 'Suspicious activity'],
    actions: ['Disable user account', 'Force password reset', 'Notify user and admin'],
    lastExecuted: '2024-01-14T16:20:00Z',
    executionCount: 5,
    successRate: 80
  }
];

// Mock automation events
const mockEvents = [
  {
    id: '1',
    ruleId: '1',
    ruleName: 'Auto-quarantine Ransomware',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'success',
    trigger: 'Ryuk ransomware detected on Endpoint-156',
    actions: ['Quarantined Endpoint-156', 'Disabled network access', 'Notified security team'],
    details: 'Successfully quarantined endpoint and prevented further spread',
    requiresApproval: false
  },
  {
    id: '2',
    ruleId: '2',
    ruleName: 'Block Malicious Domains',
    timestamp: '2024-01-15T09:45:00Z',
    status: 'success',
    trigger: 'Malicious domain malicious-site.com detected',
    actions: ['Blocked domain in firewall', 'Updated DNS blacklist', 'Logged security event'],
    details: 'Domain successfully blocked across all network segments',
    requiresApproval: false
  },
  {
    id: '3',
    ruleId: '3',
    ruleName: 'Disable Compromised Accounts',
    timestamp: '2024-01-15T09:20:00Z',
    status: 'pending',
    trigger: 'Suspicious activity detected for user john.doe',
    actions: ['Disable user account', 'Force password reset', 'Notify user and admin'],
    details: 'Awaiting human approval for account disable action',
    requiresApproval: true
  }
];

// Get automation rules
router.get('/rules', async (req, res) => {
  try {
    res.json({
      success: true,
      data: mockRules
    });
  } catch (error) {
    logger.error('Error fetching automation rules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch automation rules'
    });
  }
});

// Get automation events
router.get('/events', async (req, res) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;
    
    let filteredEvents = [...mockEvents];
    
    if (status) {
      filteredEvents = filteredEvents.filter(event => event.status === status);
    }
    
    const paginatedEvents = filteredEvents.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedEvents,
      total: filteredEvents.length
    });
  } catch (error) {
    logger.error('Error fetching automation events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch automation events'
    });
  }
});

// Toggle rule status
router.put('/rules/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const rule = mockRules.find(r => r.id === id);
    
    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Rule not found'
      });
    }
    
    rule.enabled = !rule.enabled;
    rule.updatedAt = new Date().toISOString();
    
    // Update in Elastic
    if (process.env.MOCK_DATA_ENABLED !== 'true') {
      await indexDocument('automation-rules', rule, id);
    }
    
    res.json({
      success: true,
      data: rule
    });
  } catch (error) {
    logger.error('Error toggling rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle rule'
    });
  }
});

// Execute rule manually
router.post('/rules/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const { triggerData } = req.body;
    
    const rule = mockRules.find(r => r.id === id);
    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Rule not found'
      });
    }
    
    if (!rule.enabled) {
      return res.status(400).json({
        success: false,
        error: 'Rule is disabled'
      });
    }
    
    // Simulate rule execution
    const executionResult = {
      ruleId: id,
      ruleName: rule.name,
      executedAt: new Date().toISOString(),
      status: 'success',
      actions: rule.actions,
      details: `Rule executed successfully with trigger data: ${JSON.stringify(triggerData)}`
    };
    
    // Update rule execution count
    rule.executionCount++;
    rule.lastExecuted = new Date().toISOString();
    
    // Store execution event
    const event = {
      id: Date.now().toString(),
      ...executionResult,
      requiresApproval: false
    };
    
    mockEvents.unshift(event);
    
    res.json({
      success: true,
      data: executionResult
    });
  } catch (error) {
    logger.error('Error executing rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute rule'
    });
  }
});

// Approve pending action
router.post('/events/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, notes } = req.body;
    
    const event = mockEvents.find(e => e.id === id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    if (!event.requiresApproval) {
      return res.status(400).json({
        success: false,
        error: 'Event does not require approval'
      });
    }
    
    event.status = approved ? 'success' : 'failed';
    event.approvedAt = new Date().toISOString();
    event.approvedBy = 'Current User';
    event.approvalNotes = notes;
    event.requiresApproval = false;
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error('Error approving event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve event'
    });
  }
});

// Get automation statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalRules: mockRules.length,
      activeRules: mockRules.filter(r => r.enabled).length,
      totalExecutions: mockEvents.length,
      successRate: Math.round(mockEvents.filter(e => e.status === 'success').length / mockEvents.length * 100),
      pendingApprovals: mockEvents.filter(e => e.requiresApproval).length,
      recentExecutions: mockEvents.slice(0, 5)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error fetching automation stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch automation stats'
    });
  }
});

// Create new automation rule
router.post('/rules', async (req, res) => {
  try {
    const { name, description, trigger, conditions, actions } = req.body;
    
    const newRule = {
      id: Date.now().toString(),
      name,
      description,
      enabled: true,
      trigger,
      conditions,
      actions,
      lastExecuted: null,
      executionCount: 0,
      successRate: 0,
      createdAt: new Date().toISOString()
    };
    
    mockRules.push(newRule);
    
    // Store in Elastic
    if (process.env.MOCK_DATA_ENABLED !== 'true') {
      await indexDocument('automation-rules', newRule);
    }
    
    res.json({
      success: true,
      data: newRule
    });
  } catch (error) {
    logger.error('Error creating automation rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create automation rule'
    });
  }
});

module.exports = router;
