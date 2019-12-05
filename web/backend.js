/* eslint-disable import/newline-after-import */
// initialize tracer
const express = require('express');
const CLSContext = require('zipkin-context-cls');
const {Tracer} = require('zipkin');
const {recorder} = require('./recorder');

const ctxImpl = new CLSContext('zipkin');
const localServiceName = 'backend';
const tracer = new Tracer({ctxImpl, recorder: recorder(localServiceName), localServiceName});

const app = express();

// instrument the server
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
app.use(zipkinMiddleware({tracer}));

function sleep(milliseconds) {
  const start = new Date().getTime();
  for (let i = 0; i < 1e10; i += 1) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

app.get('/api', (req, res) => {
  sleep(1500);
  res.send(new Date().toString());
});

app.listen(9000, () => {
  console.log('Backend listening on port 9000!');
});
