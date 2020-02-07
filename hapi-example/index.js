'use strict'

const Hapi = require('@hapi/hapi')
const fetch = require('node-fetch')
const wrapFetch = require('zipkin-instrumentation-fetch')
const zipkinMiddleware = require('zipkin-instrumentation-hapi').hapiMiddleware
const tracer = require('./tracer')

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  })
  const zipkinFetch = wrapFetch(fetch, { tracer })
  await server.register({
    plugin: zipkinMiddleware,
    options: { tracer },
  })
  const headers = {
    'Content-Type': 'application/json',
  }
  const data = {
    method: 'GET',
    headers,
  }
  const doCall = () =>
    zipkinFetch('https://reqres.in/api/users', data)
      .then(res => res.json())
      .then(response => response)

  server.route({
    method: 'GET',
    path: '/',
    config: {
      pre: [
        {
          method: () => {
            return doCall()
          },
          assign: 'users',
        },
        {
          method: () => {
            return doCall()
          },
          assign: 'users2',
        },
        [
          {
            method: () => {
              return doCall()
            },
            assign: 'users3',
          },
          {
            method: () => {
              return doCall()
            },
            assign: 'users4',
          },
          {
            method: () => {
              return doCall()
            },
            assign: 'users5',
          },
        ],
      ],
    },
    handler: request => {
      return request.pre.users
    },
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
