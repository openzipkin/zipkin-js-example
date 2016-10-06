const {tracer} = require('./tracer.js');

const express = require('express');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;

const app = express();

// Add the Zipkin middleware
app.use(zipkinMiddleware({
  tracer,
  serviceName: 'frontend' // name of this application
}));

// Allow cross-origin, traced requests. See http://enable-cors.org/server_expressjs.html
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, X-B3-TraceId, X-B3-ParentSpanId, X-B3-SpanId, X-B3-Sampled');
  next();
});

// Actual http call that will end up in the trace
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(8081, () => {
  console.log('Frontend listening on port 8081!');
});
