# Basic example showing distributed tracing from a web browser across node.js apps
This is an example app where a web browser and two express (node.js) services collaborate on an http request. Notably, timing of these requests are recorded into [Zipkin](https://zipkin.io/), a distributed tracing system. This allows you to see the how long the whole operation took, as well how much time was spent in each service.

Here's an example of what it looks like
<img width="1024" alt="zipkin screen shot" src="https://user-images.githubusercontent.com/64215/60377642-51f8df00-9a4b-11e9-88f0-a33428e6110c.png" />

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

Next, run [Zipkin](https://zipkin.io/), which stores and queries traces reported by the browser and above services.

```bash
$ curl -sSL https://zipkin.io/quickstart.sh | bash -s
$ java -jar zipkin.jar
```

Or, if you're using docker:

```bash
$ docker run -d -p 9411:9411 openzipkin/zipkin
```

## Debugging
zipkin-js bundles events together and asynchronously sends them as json to Zipkin.

If you want to see which events are recorded vs the json sent to Zipkin as json, start your servers differently:
```bash
$ DEBUG=true npm start
```

Here's example output:
```
$ DEBUG=true npm start

> zipkin-js-example@0.0.1 start /Users/acole/oss/zipkin-js-example/web
> node servers.js

Backend listening on port 9000!
Frontend listening on port 8081!
frontend recording: a1b7b7274a26ac85/a1b7b7274a26ac85 ServiceName("frontend")
frontend recording: a1b7b7274a26ac85/a1b7b7274a26ac85 Rpc("OPTIONS")
frontend recording: a1b7b7274a26ac85/a1b7b7274a26ac85 BinaryAnnotation(http.path="/")
frontend recording: a1b7b7274a26ac85/a1b7b7274a26ac85 ServerRecv()
frontend recording: a1b7b7274a26ac85/a1b7b7274a26ac85 LocalAddr(host="InetAddress(192.168.43.211)", port=0)
frontend recording: a1b7b7274a26ac85/a1b7b7274a26ac85 BinaryAnnotation(http.status_code="200")
frontend recording: a1b7b7274a26ac85/a1b7b7274a26ac85 ServerSend()
frontend reporting: {"traceId":"a1b7b7274a26ac85","id":"a1b7b7274a26ac85","name":"options","kind":"SERVER","timestamp":1561769117353000,"duration":8233,"localEndpoint":{"serviceName":"frontend","ipv4":"192.168.43.211"},"tags":{"http.path":"/","http.status_code":"200"}}
--snip--
```

You can also see this in the browser's javascript console, if you reload index.html with the query parameter `?debug`.

Here's example output:

<img width="1178" alt="browser debug" src="https://user-images.githubusercontent.com/64215/60377536-bb2c2280-9a4a-11e9-81c2-421ae2e1d125.png">
