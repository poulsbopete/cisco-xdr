// Initialize OpenTelemetry first (commented out for now)
// require('./tracing');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-cloudfront-domain.cloudfront.net'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/threat-hunting', require('./routes/threatHunting'));
app.use('/api/alert-triage', require('./routes/alertTriage'));
app.use('/api/incident-builder', require('./routes/incidentBuilder'));
app.use('/api/response-automation', require('./routes/responseAutomation'));
app.use('/api/analyst-copilot', require('./routes/analystCopilot'));
app.use('/api/predictive-defense', require('./routes/predictiveDefense'));
app.use('/api/sre-health', require('./routes/sreHealth'));
app.use('/api/elastic', require('./routes/elastic'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
});
