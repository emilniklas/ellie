# 0.2.0
* Change the `Pipeline` constructor's role to internal, and
  introduce the `Pipeline.make` factory.
* Refactor and provide some inline documentation for the
  Pipeline module.
* Introduce decorators on the Pipeline.

```javascript
const pipeline = pipe(
  () => () => 'hello'
)

await pipeline.pipe() // hello

const decorated = pipeline
  .decorate(w => w.toUpperCase())

await decorated.pipe() // HELLO
```

# 0.1.0
* Initialize project
* Set up build with Eliot
* Introduce the Pipeline

```javascript
import { Pipeline } from 'ellie'

const pipeline = Pipeline.make([
  SomeMiddleware,
  SomeOtherPipeline,
  AThirdPipeline
])

const response = await pipeline.pipe("Request")

console.log(response) // "Response"
```

* Set up a server implementation using the pipeline

```javascript
import { Pipeline, Server } from 'ellie'
import { createServer } from 'http'

const pipeline = Pipeline.make(...)
const server = new Server(pipeline, createServer)

server.listen(8080).then(() => {
  console.log('Listening to port 8080')
})
```

* Set up helpers for pipeline and server

```javascript
import { pipe, serve } from 'ellie'

const pipeline = pipe(
  Middleware1,
  Middleware2
)

serve(pipeline)
  .listen(8080)
  .then(() => {
    console.log('Listening to port 8080')
  })
```
