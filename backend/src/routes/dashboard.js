const express = require('express');
const router = express.Router();
const { searchDocuments } = require('../config/elastic');
const logger = require('../config/logger');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalAlerts: 1284,
      criticalAlerts: 23,
      threatsHunted: 156,
      incidentsCreated: 42,
      automatedResponses: 89,
      predictionsGenerated: 12,
      trends: {
        alerts: '+12%',
        threats: '+24%',
        incidents: '+18%',
        responses: '+31%',
        predictions: '+7%'
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats'
    });
  }
});

// Get alert trends
router.get('/trends', async (req, res) => {
  try {
    const trends = [
      { time: '00:00', alerts: 12, threats: 2 },
      { time: '04:00', alerts: 8, threats: 1 },
      { time: '08:00', alerts: 25, threats: 4 },
      { time: '12:00', alerts: 18, threats: 3 },
      { time: '16:00', alerts: 32, threats: 6 },
      { time: '20:00', alerts: 15, threats: 2 },
    ];

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    logger.error('Error fetching trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trends'
    });
  }
});

// Get threat categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { category: 'Malware', count: 45, percentage: 35 },
      { category: 'Phishing', count: 32, percentage: 25 },
      { category: 'Insider Threat', count: 28, percentage: 22 },
      { category: 'DDoS', count: 15, percentage: 12 },
      { category: 'Data Exfiltration', count: 8, percentage: 6 },
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// Get recent activity
router.get('/activity', async (req, res) => {
  try {
    const activity = [
      {
        id: 1,
        type: 'threat_hunt',
        message: 'AI agent discovered new APT campaign targeting financial sector',
        time: '2 minutes ago',
        severity: 'critical'
      },
      {
        id: 2,
        type: 'automated_response',
        message: 'Automatically quarantined 3 endpoints with suspicious behavior',
        time: '5 minutes ago',
        severity: 'high'
      },
      {
        id: 3,
        type: 'incident_created',
        message: 'Generated incident case for ransomware attack on workstation-042',
        time: '12 minutes ago',
        severity: 'critical'
      },
      {
        id: 4,
        type: 'prediction',
        message: 'ML model predicts potential DDoS attack within next 4 hours',
        time: '18 minutes ago',
        severity: 'medium'
      }
    ];

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    logger.error('Error fetching activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity'
    });
  }
});

module.exports = router;
