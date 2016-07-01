# ellie

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

import { pipe, serve, Response } from 'ellie'

const HelloWorld = () => (request) => {
  return Response.ok(`
    <h1>Hello world, from ${request.url}!</h1>
  `)
}

const pipeline = pipe(HelloWorld)

serve(pipeline)
  .listen(8080)
  .then(() => console.log('Listening to port 8080'))
```

Run instantly

```shell
> eliot index.js
Listening to port 8080
```
