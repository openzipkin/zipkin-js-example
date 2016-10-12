/* eslint-env browser */
// use higher-precision time than milliseconds
process.hrtime = require('browser-process-hrtime');

// setup tracer
const {recorder} = require('./recorder.js');
const {Tracer, ExplicitContext} = require('zipkin');
const ctxImpl = new ExplicitContext();
const tracer = new Tracer({ctxImpl, recorder});

// instrument fetch
const wrapFetch = require('zipkin-instrumentation-fetch');
const zipkinFetch = wrapFetch(fetch, {tracer, serviceName: 'browser'});

// wrap fetch call so that it is traced
zipkinFetch('http://localhost:8081/')
  .then((response) => (response.text()))
  .then((text) => (document.writeln(text)))
  .catch((ex) => {
    console.log('failed', ex);
  });
