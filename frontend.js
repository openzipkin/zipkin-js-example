// initialize tracer
const {recorder} = require('./recorder.js');
const {Tracer} = require('zipkin');
const CLSContext = require('zipkin-context-cls');
const ctxImpl = new CLSContext('zipkin');
const tracer = new Tracer({ctxImpl, recorder});

const express = require('express');
const app = express();
const rest = require('rest');

// instrument the server
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
app.use(zipkinMiddleware({
  tracer,
  serviceName: 'frontend' // name of this application
}));

// instrument the client
const {restInterceptor} = require('zipkin-instrumentation-cujojs-rest');
const zipkinRest = rest.wrap(restInterceptor, {tracer, serviceName: 'frontend'});

// Allow cross-origin, traced requests. See http://enable-cors.org/server_expressjs.html
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, X-B3-TraceId, X-B3-ParentSpanId, X-B3-SpanId, X-B3-Sampled');
  next();
});

app.get('/', (req, res) => {
  zipkinRest('http://localhost:9000/api')
    .then(
      (response) => res.send(response.entity),
      (response) => console.error("Error", response.status)
    );
});

app.listen(8081, () => {
  console.log('Frontend listening on port 8081!');
});
