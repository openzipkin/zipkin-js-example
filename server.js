const {Tracer, BatchRecorder, ExplicitContext} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');
const zipkinBaseUrl = 'http://localhost:9411'
const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: zipkinBaseUrl + '/api/v1/spans'
  })
});
const ctxImpl = new ExplicitContext();
const tracer = new Tracer({ctxImpl, recorder});

const express = require('express');
const proxy = require('express-http-proxy');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;

const app = express();
app.use(express.static('public'));

// Add the Zipkin middleware
app.use(zipkinMiddleware({
  tracer,
  serviceName: 'server' // name of this application
}));

// Serve the bundled browser.js
app.get('/', function (req, res) {
  res.send('<html><body><script src="/bundle.js"></script></body></html>');
});

// Mount zipkin's POST endpoint to /zipkin for browsers to use
// In real life, you can re-use your existing auth api when proxying
app.use('/zipkin', proxy(zipkinBaseUrl, {
  forwardPath: function(req, res) {
    return '/api/v1/spans'
  }
}));

// Actual http call that will end up in the trace
app.get('/api', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
