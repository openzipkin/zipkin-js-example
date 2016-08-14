const {Tracer, BatchRecorder, ExplicitContext} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');

// Send spans to the origin server under the path /zipkin
const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: location.origin + '/zipkin'
  })
});

const ctxImpl = new ExplicitContext();
const tracer = new Tracer({ctxImpl, recorder});

const wrapFetch = require('zipkin-instrumentation-fetch');
const zipkinFetch = wrapFetch(fetch, {tracer, serviceName: 'browser'});

// wrap fetch call so that it is traced
var result = zipkinFetch('/api')
result.then(function(response) {
  return response.text()
}).catch(function(ex) {
  console.log('failed', ex)
})
