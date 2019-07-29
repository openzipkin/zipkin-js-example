/* eslint-disable import/newline-after-import */
// initialize tracer
const axios = require('axios');
const express = require('express');
const CLSContext = require('zipkin-context-cls');
const {Tracer} = require('zipkin');
const {recorder} = require('./recorder');

const ctxImpl = new CLSContext('zipkin');
const localServiceName = 'frontend';
const tracer = new Tracer({ctxImpl, recorder: recorder(localServiceName), localServiceName});

const app = express();

// instrument the server
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
app.use(zipkinMiddleware({tracer}));

// instrument the client
const wrapAxios = require('zipkin-instrumentation-axiosjs');
const zipkinAxios = wrapAxios(axios, {tracer});

// Allow cross-origin, traced requests. See http://enable-cors.org/server_expressjs.html
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', [
    'Origin', 'Accept', 'X-Requested-With', 'X-B3-TraceId',
    'X-B3-ParentSpanId', 'X-B3-SpanId', 'X-B3-Sampled'
  ].join(', '));
  next();
});

app.get('/', (req, res) => {
  tracer.local('pay-me', () =>
    zipkinAxios.get('http://localhost:9000/api')
      .then(response => res.send(response.data))
      .catch(err => console.error('Error', err.response ? err.response.status : err.message))
  );
});

app.listen(8081, () => {
  console.log('Frontend listening on port 8081!');
});
