/* eslint-env browser */
const {Tracer, BatchRecorder, ExplicitContext} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');
const wrapFetch = require('zipkin-instrumentation-fetch');

// Send spans to the origin server under the path /zipkin
const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: `${location.origin}/zipkin`
  })
});

const ctxImpl = new ExplicitContext();
const tracer = new Tracer({ctxImpl, recorder});
const zipkinFetch = wrapFetch(fetch, {tracer, serviceName: 'browser'});

// wrap fetch call so that it is traced
zipkinFetch('/api')
  .then((response) => (response.text()))
  .catch((ex) => {
    console.log('failed', ex);
  });
