WIP

Startup zipkin on localhost, then start the node server
```bash
$ browserify browser.js -o public/bundle.js 
$ node server.js 
```

Hit http://localhost:3000/ a couple times (note there's no content)
Look at zipkin http://localhost:9411/?serviceName=browser
