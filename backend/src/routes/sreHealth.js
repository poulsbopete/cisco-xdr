const express = require('express');
const router = express.Router();

// Mock SRE health data
const generateSREHealthData = () => {
  const services = [
    { name: 'API Gateway', status: 'healthy', uptime: '99.9%', responseTime: 45, errorRate: 0.1 },
    { name: 'User Service', status: 'healthy', uptime: '99.8%', responseTime: 120, errorRate: 0.2 },
    { name: 'Database', status: 'warning', uptime: '99.5%', responseTime: 200, errorRate: 0.5 },
    { name: 'Cache Layer', status: 'healthy', uptime: '99.9%', responseTime: 15, errorRate: 0.1 },
    { name: 'Message Queue', status: 'critical', uptime: '98.2%', responseTime: 500, errorRate: 2.1 },
    { name: 'File Storage', status: 'healthy', uptime: '99.9%', responseTime: 80, errorRate: 0.1 }
  ];

  const metrics = [
    { time: '00:00', value: 45, threshold: 100 },
    { time: '04:00', value: 38, threshold: 100 },
    { time: '08:00', value: 120, threshold: 100 },
    { time: '12:00', value: 95, threshold: 100 },
    { time: '16:00', value: 110, threshold: 100 },
    { time: '20:00', value: 75, threshold: 100 }
  ];

  const overallHealth = 87;

  const aiActions = [
    {
      type: 'auto-scaling',
      message: 'Auto-scaling triggered',
      details: 'Message Queue service scaled up 2 instances',
      timestamp: new Date().toISOString()
    },
    {
      type: 'optimization',
      message: 'Health check passed',
      details: 'Database connection pool optimized',
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      type: 'threshold-adjustment',
      message: 'Alert threshold adjusted',
      details: 'Response time threshold increased to 150ms',
      timestamp: new Date(Date.now() - 600000).toISOString()
    }
  ];

  return {
    services,
    metrics,
    overallHealth,
    aiActions,
    timestamp: new Date().toISOString()
  };
};

// Get SRE health overview
router.get('/overview', (req, res) => {
  try {
    const data = generateSREHealthData();
    res.json({
      success: true,
      data,
      message: 'SRE health data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching SRE health data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch SRE health data',
      message: error.message
    });
  }
});

// Get service health details
router.get('/services', (req, res) => {
  try {
    const data = generateSREHealthData();
    res.json({
      success: true,
      data: data.services,
      message: 'Service health data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching service health data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service health data',
      message: error.message
    });
  }
});

// Get performance metrics
router.get('/metrics', (req, res) => {
  try {
    const data = generateSREHealthData();
    res.json({
      success: true,
      data: data.metrics,
      message: 'Performance metrics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics',
      message: error.message
    });
  }
});

// Get AI assistant actions
router.get('/ai-actions', (req, res) => {
  try {
    const data = generateSREHealthData();
    res.json({
      success: true,
      data: data.aiActions,
      message: 'AI assistant actions retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching AI assistant actions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI assistant actions',
      message: error.message
    });
  }
});

module.exports = router;
