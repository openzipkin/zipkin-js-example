const {
  Tracer,
  BatchRecorder,
  sampler,
  jsonEncoder: { JSON_V2 },
} = require('zipkin')
const CLSContext = require('zipkin-context-cls')
const { HttpLogger } = require('zipkin-transport-http')

const ctxImpl = new CLSContext('zipkin')

const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: 'http://localhost:9411/api/v2/spans',
    jsonEncoder: JSON_V2,
  }),
})

module.exports = new Tracer({
  ctxImpl,
  recorder,
  sampler: new sampler.CountingSampler(1),
  localServiceName: 'createwebbff',
})
