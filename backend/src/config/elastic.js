const { Client } = require('@elastic/elasticsearch');
const logger = require('./logger');

let client;

const getElasticClient = () => {
  if (client) {
    return client;
  }

  try {
    if (process.env.ELASTIC_CLOUD_ID && process.env.ELASTIC_API_KEY) {
      // Elastic Cloud connection
      const nodeUrl = process.env.ELASTIC_CLOUD_ID.includes('://') 
        ? process.env.ELASTIC_CLOUD_ID
        : `https://${process.env.ELASTIC_CLOUD_ID}:443`;
      
      client = new Client({
        node: nodeUrl,
        auth: {
          apiKey: process.env.ELASTIC_API_KEY,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      logger.info('Elasticsearch client initialized with direct URL and API Key');
    } else if (process.env.ELASTIC_USERNAME && process.env.ELASTIC_PASSWORD) {
      // Basic auth connection
      client = new Client({
        node: process.env.ELASTIC_NODE || 'https://localhost:9200',
        auth: {
          username: process.env.ELASTIC_USERNAME,
          password: process.env.ELASTIC_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false, // For development only
        },
      });
      logger.info('Elasticsearch client initialized with basic auth');
    } else {
      // Mock client for demo mode
      client = {
        search: async () => ({ hits: { hits: [], total: { value: 0 } } }),
        index: async () => ({ _id: 'mock-id', result: 'created' }),
        update: async () => ({ _id: 'mock-id', result: 'updated' }),
        delete: async () => ({ _id: 'mock-id', result: 'deleted' }),
        indices: {
          create: async () => ({ acknowledged: true }),
          exists: async () => false,
        },
      };
      logger.info('Elasticsearch client initialized in mock mode');
    }

    return client;
  } catch (error) {
    logger.error('Failed to initialize Elasticsearch client:', error);
    throw error;
  }
};

const createIndexIfNotExists = async (indexName, mapping = {}) => {
  const elasticClient = getElasticClient();
  
  try {
    const exists = await elasticClient.indices.exists({ index: indexName });
    if (!exists) {
      await elasticClient.indices.create({
        index: indexName,
        body: {
          mappings: mapping,
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
        },
      });
      logger.info(`Created index: ${indexName}`);
    }
  } catch (error) {
    logger.error(`Error creating index ${indexName}:`, error);
    throw error;
  }
};

const searchDocuments = async (indexName, query, size = 100) => {
  const elasticClient = getElasticClient();
  
  try {
    const response = await elasticClient.search({
      index: indexName,
      body: {
        query,
        size,
        sort: [{ '@timestamp': { order: 'desc' } }],
      },
    });
    
    return response.body;
  } catch (error) {
    logger.error(`Error searching index ${indexName}:`, error);
    throw error;
  }
};

const indexDocument = async (indexName, document, id = null) => {
  const elasticClient = getElasticClient();
  
  try {
    const body = {
      index: indexName,
      body: document,
    };
    
    if (id) {
      body.id = id;
    }
    
    const response = await elasticClient.index(body);
    return response.body;
  } catch (error) {
    logger.error(`Error indexing document in ${indexName}:`, error);
    throw error;
  }
};

module.exports = {
  getElasticClient,
  createIndexIfNotExists,
  searchDocuments,
  indexDocument,
};
