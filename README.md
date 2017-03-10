# Basic example showing distributed tracing from a web browser across node.js apps
This is an example app where a web browser and two express (node.js) services collaborate on an http request. Notably, timing of these requests are recorded into [Zipkin](http://zipkin.io/), a distributed tracing system. This allows you to see the how long the whole operation took, as well how much time was spent in each service.

Here's an example of what it looks like
<img width="972" alt="zipkin screen shot" src="https://cloud.githubusercontent.com/assets/64215/19316259/5a23bd0a-90d3-11e6-9034-c9c3cf26db28.png">

This example was initially shown at [DevOpsDays Singapore on Oct 8, 2016](https://speakerdeck.com/adriancole/introduction-to-distributed-tracing-and-zipkin-at-devopsdays-singapore). It was ported from similar examples, such as [Spring Boot](https://github.com/openzipkin/sleuth-webmvc-example).

# Implementation Overview

Web requests are served by [Express](http://expressjs.com/) controllers, and tracing is automatically performed for you by [zipkin-js](https://github.com/openzipkin/zipkin-js). JavaScript used in the web browser is bundled with [browserify](http://browserify.org/).

# Running the example
This example has two services: frontend and backend. They both report trace data to zipkin. To setup the demo, you need to start frontend.js, backend.js and Zipkin. You'll also need to bundle the JavaScript used by the web browser.

Once the services are started, and the JavaScript is bundled, `open index.html`
* This starts a trace in the browser and calls the frontend (http://localhost:8081/)
* This continues the trace and calls the backend (http://localhost:9000/api) and show the result, which defaults to a formatted date.

Next, you can view traces that went through the backend via http://localhost:9411/?serviceName=browser
* This is a locally run zipkin service which keeps traces in memory

## Setup

Before you start anything, you'll need to download the libraries used in this demo:
```bash
$ npm install
```

Once that's done, bundle the JavaScript used by the browser:
```bash
$ npm run browserify
```

## Starting the Services
In a separate tab or window, run `npm start`, which will start both [frontend.js](./frontend.js) and [backend.js](./backend.js):
```bash
$ npm start
```

Next, run [Zipkin](http://zipkin.io/), which stores and queries traces reported by the browser and above services.

```bash
$ wget -O zipkin.jar 'https://search.maven.org/remote_content?g=io.zipkin.java&a=zipkin-server&v=LATEST&c=exec'
$ java -jar zipkin.jar
```

Or, if you're using docker:

```bash
$ docker run -d -p 9411:9411 openzipkin/zipkin
```
