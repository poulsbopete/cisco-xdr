const express = require('express');
const router = express.Router();
const { getElasticClient, createIndexIfNotExists, searchDocuments, indexDocument } = require('../config/elastic');
const logger = require('../config/logger');

// Health check for Elastic connection
router.get('/health', async (req, res) => {
  try {
    const client = getElasticClient();
    
    // Test connection
    const health = await client.cluster.health();
    
    res.json({
      success: true,
      data: {
        status: health.body.status,
        cluster_name: health.body.cluster_name,
        number_of_nodes: health.body.number_of_nodes,
        active_shards: health.body.active_shards
      }
    });
  } catch (error) {
    logger.error('Elastic health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Elastic connection failed',
      details: process.env.MOCK_DATA_ENABLED === 'true' ? 'Using mock data' : error.message
    });
  }
});

// Search across all indices
router.post('/search', async (req, res) => {
  try {
    const { query, indices = [], size = 100, from = 0 } = req.body;
    
    if (process.env.MOCK_DATA_ENABLED === 'true') {
      // Return mock search results
      const mockResults = {
        hits: {
          total: { value: 25 },
          hits: [
            {
              _index: 'security-events',
              _id: '1',
              _score: 0.95,
              _source: {
                timestamp: '2024-01-15T10:30:00Z',
                event_type: 'malware_detected',
                severity: 'high',
                source: 'Cisco XDR',
                description: 'Malware detected on endpoint'
              }
            },
            {
              _index: 'threat-intel',
              _id: '2',
              _score: 0.87,
              _source: {
                timestamp: '2024-01-15T10:25:00Z',
                threat_type: 'phishing',
                severity: 'medium',
                source: 'Elastic SIEM',
                description: 'Suspicious email detected'
              }
            }
          ]
        }
      };
      
      return res.json({
        success: true,
        data: mockResults
      });
    }
    
    const client = getElasticClient();
    
    const searchBody = {
      query: query || { match_all: {} },
      size,
      from,
      sort: [{ '@timestamp': { order: 'desc' } }]
    };
    
    const searchParams = {
      body: searchBody
    };
    
    if (indices.length > 0) {
      searchParams.index = indices.join(',');
    }
    
    const response = await client.search(searchParams);
    
    res.json({
      success: true,
      data: response.body
    });
  } catch (error) {
    logger.error('Elastic search failed:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      details: error.message
    });
  }
});

// Get index information
router.get('/indices', async (req, res) => {
  try {
    if (process.env.MOCK_DATA_ENABLED === 'true') {
      const mockIndices = [
        {
          index: 'security-events',
          health: 'green',
          status: 'open',
          docs_count: 125000,
          store_size: '2.5gb'
        },
        {
          index: 'threat-intel',
          health: 'green',
          status: 'open',
          docs_count: 45000,
          store_size: '1.2gb'
        },
        {
          index: 'alerts',
          health: 'yellow',
          status: 'open',
          docs_count: 8500,
          store_size: '450mb'
        }
      ];
      
      return res.json({
        success: true,
        data: mockIndices
      });
    }
    
    const client = getElasticClient();
    const response = await client.cat.indices({ format: 'json' });
    
    const indices = response.body.map(index => ({
      index: index.index,
      health: index.health,
      status: index.status,
      docs_count: parseInt(index['docs.count']),
      store_size: index['store.size']
    }));
    
    res.json({
      success: true,
      data: indices
    });
  } catch (error) {
    logger.error('Failed to get indices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get indices',
      details: error.message
    });
  }
});

// Create new index
router.post('/indices', async (req, res) => {
  try {
    const { name, mapping, settings } = req.body;
    
    if (process.env.MOCK_DATA_ENABLED === 'true') {
      return res.json({
        success: true,
        data: {
          index: name,
          acknowledged: true,
          message: 'Mock index created successfully'
        }
      });
    }
    
    const client = getElasticClient();
    
    const indexBody = {};
    if (mapping) indexBody.mappings = mapping;
    if (settings) indexBody.settings = settings;
    
    const response = await client.indices.create({
      index: name,
      body: indexBody
    });
    
    res.json({
      success: true,
      data: response.body
    });
  } catch (error) {
    logger.error('Failed to create index:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create index',
      details: error.message
    });
  }
});

// Index document
router.post('/index/:indexName', async (req, res) => {
  try {
    const { indexName } = req.params;
    const { document, id } = req.body;
    
    if (process.env.MOCK_DATA_ENABLED === 'true') {
      return res.json({
        success: true,
        data: {
          _index: indexName,
          _id: id || 'mock-id',
          result: 'created'
        }
      });
    }
    
    const result = await indexDocument(indexName, document, id);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Failed to index document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to index document',
      details: error.message
    });
  }
});

// Get cluster stats
router.get('/cluster/stats', async (req, res) => {
  try {
    if (process.env.MOCK_DATA_ENABLED === 'true') {
      const mockStats = {
        cluster_name: 'elastic-cluster',
        cluster_uuid: 'mock-uuid',
        timestamp: Date.now(),
        status: 'green',
        nodes: {
          count: {
            total: 3,
            data: 2,
            master: 1
          }
        },
        indices: {
          count: 15,
          shards: {
            total: 45,
            primaries: 15
          },
          docs: {
            count: 250000,
            deleted: 5000
          },
          store: {
            size_in_bytes: 5000000000
          }
        }
      };
      
      return res.json({
        success: true,
        data: mockStats
      });
    }
    
    const client = getElasticClient();
    const response = await client.cluster.stats();
    
    res.json({
      success: true,
      data: response.body
    });
  } catch (error) {
    logger.error('Failed to get cluster stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cluster stats',
      details: error.message
    });
  }
});

// Get field mappings
router.get('/mappings/:indexName', async (req, res) => {
  try {
    const { indexName } = req.params;
    
    if (process.env.MOCK_DATA_ENABLED === 'true') {
      const mockMappings = {
        [indexName]: {
          mappings: {
            properties: {
              '@timestamp': { type: 'date' },
              'event_type': { type: 'keyword' },
              'severity': { type: 'keyword' },
              'source': { type: 'keyword' },
              'description': { type: 'text' },
              'message': { type: 'text' }
            }
          }
        }
      };
      
      return res.json({
        success: true,
        data: mockMappings
      });
    }
    
    const client = getElasticClient();
    const response = await client.indices.getMapping({ index: indexName });
    
    res.json({
      success: true,
      data: response.body
    });
  } catch (error) {
    logger.error('Failed to get mappings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get mappings',
      details: error.message
    });
  }
});

module.exports = router;
