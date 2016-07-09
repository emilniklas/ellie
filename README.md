# ellie

[![Code Style: StandardJS](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Build Status](https://travis-ci.org/emilniklas/ellie.svg?branch=develop)](https://travis-ci.org/emilniklas/ellie)

## Usage

Simple installation

```shell
> echo {} > package.json
> npm install --save ellie eliot
> touch index.js
```

Simple API

```javascript
// index.js

import { serve } from 'ellie'

const HelloWorld = () => (request) => (
  <div>
    <h1>Hello World</h1>
    <pre>{request.method} {request.url}</pre>
  </div>
)

serve(HelloWorld)
  .listen(8080)
  .then(() => console.log('Listening to port 8080'))
```

Run instantly

```shell
> eliot index.js --jsx
Listening to port 8080
```

## In depth
Ellie uses a promise based middleware system, inspired by
[Dart's Shelf](https://pub.dartlang.org/packages/shelf) package.
All the data structures are implemented in an immutable way,
so that you have absolute control over the requests and responses
in your application.

A "pipeline" is constructed by a list of middleware. A middleware is
a function or a class that receives a reference to the next middleware,
and handles an incoming request. The middleware should always either
return a response or throw an error. It can either create the response
itself (i.e. return a value that either is a Response, or can be casted to a Response)
or pass the request into the next middleware and get a response back.

It can also create a new pipeline and pass the request into that one
instead.

You can think of it as a tree. A request is passed in through the trunk,
and each branch returns a response or throws an error. Each junction
or split in a branch is dictated by middleware.

```
                                   Middleware

                                       +
                                       |
                                       v

                                      +-----+
                          Middleware  | <-+ RESPONSE
                                      | +---+
             Middleware       +       | |
                              |       | |
                 +            v       | |
                 |                    | |
                 v           +--------+ |
                             |          | <--+ Middleware
      +------------+         |          |
     RESPONSE +->  |         |   +------+     +--------+
      +---------+  |         |   |            | <-+ RESPONSE
                |  |         |   |            |  +-----+
                |  |         |   |            |  |
                |  +---------+   +------------+  |
                |                                |
Middleware +--> |        Middleware              | <--+ Middleware
                +--------+       +---------------+
                         |       |
                         |       |
                         |       |
                         |       |
                         |       |
                         +       +
                            ^ +
                    REQUEST | | RESPONSE
                            + v
```

The implementation of a middleware can be broken down into
steps. The middleware receives the next middleware and
returns the function that receives the request.

```javascript
(next) => (request) => 'response'
```

Expanded, it could look something like this:

```javascript
const MyMiddleware = (next) => {
  // Any set up can be done here. Will run once.

  return async function (request) {
    // This is run for every request, obviously. Must return a response.

    // Option 1. Delegate to the next middleware
    return next(request)

    // Option 2. Return response
    return 'Hello world!'

    // Option 3. Throw an error
    throw new Error('Something went wrong!')

    // Option 4. Delegate to other pipeline
    return someOtherPipeline.pipe(request)
  }
}

// Used like this
pipe(
  MyMiddleware
)
```

If your middleware needs arguments, you can simply wrap it in another function.

```javascript
const MyMiddleware = (argument) => (next) => (request) => ...

// Used like this
pipe(
  MyMiddleware('some argument')
)
```

The pipeline is made from multiple middleware, like this:

```javascript
pipe(
  (next) => async function (request) {
    // Do something with request
    const response = await next(request)
    // Do something with response
    return response
  },
  (next) => async function (request) {
    // Do something with request
    const response = await next(request)
    // Do something with response
    return response
  },
  () => async function (request) {
    // Do something with request
    return 'some response'
  }
)
```
