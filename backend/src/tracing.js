const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Elastic OTLP Configuration
const ELASTIC_OTLP_ENDPOINT = 'https://a5630c65c43f4f299288c392af0c2f45.ingest.us-east-1.aws.elastic.cloud:443';
const ELASTIC_API_KEY = 'bzd3bEpaa0IyQXpMVkdwcjltSU86SS1TekJGZ01zWG45RWN5cnhyd3JYUQ==';

// Create OTLP exporters
const traceExporter = new OTLPTraceExporter({
  url: `${ELASTIC_OTLP_ENDPOINT}/v1/traces`,
  headers: {
    'Authorization': `ApiKey ${ELASTIC_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const metricExporter = new OTLPMetricExporter({
  url: `${ELASTIC_OTLP_ENDPOINT}/v1/metrics`,
  headers: {
    'Authorization': `ApiKey ${ELASTIC_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Initialize OpenTelemetry SDK
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'cisco-xdr-backend',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'development',
  }),
  traceExporter,
  metricExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Disable some instrumentations that might be too verbose
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
});

// Start the SDK
sdk.start();

console.log('🔍 OpenTelemetry initialized and sending data to Elastic Cloud');
console.log(`📊 OTLP Endpoint: ${ELASTIC_OTLP_ENDPOINT}`);

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry terminated'))
    .catch((error) => console.log('Error terminating OpenTelemetry', error))
    .finally(() => process.exit(0));
});

module.exports = sdk;
