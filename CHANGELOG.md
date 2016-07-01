# 0.0.1
* Initialize project
* Set up build with Eliot
* Introduce the Pipeline

```javascript
import { Pipeline } from 'ellie'

const pipeline = new Pipeline([
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

const pipeline = new Pipeline(...)
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
