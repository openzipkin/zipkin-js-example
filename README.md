# Basic example starting a trace in the browser and propagating it to a node.js server

First, run the frontend, which will listen on http://localhost:8081

```bash
$ node frontend.js
```

Next, run [Zipkin](http://zipkin.io/), which stores and queries traces reported by the above services.

```bash
$ wget -O zipkin.jar 'https://search.maven.org/remote_content?g=io.zipkin.java&a=zipkin-server&v=LATEST&c=exec'
$ java -jar zipkin.jar
```

Now, build javascript that traces requests in the browser.

```bash
# index.html executes bundle.js which traces a request to http://localhost:8081
$ browserify browser.js -o bundle.js
```

Finally, `open index.html` and reload a couple times. You can see traces in zipkin here: http://localhost:9411/?serviceName=browser
