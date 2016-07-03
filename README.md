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
