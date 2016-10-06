/* eslint-env browser */
const {tracer} = require('./tracer.js');

const wrapFetch = require('zipkin-instrumentation-fetch');
const zipkinFetch = wrapFetch(fetch, {tracer, serviceName: 'browser'});

// wrap fetch call so that it is traced
zipkinFetch('http://localhost:8081/')
  .then((response) => (response.text()))
  .then((text) => (document.writeln(text)))
  .catch((ex) => {
    console.log('failed', ex);
  });
