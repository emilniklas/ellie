# 0.3.0
* `serve` can now take middleware directly.
* A new `basicMiddleware` list is now exported from the package, allowing
  for quick access to the basic catch-all middleware that you'll probably
  always want.

```javascript
import { serve, basicMiddleware } from 'ellie'

serve(
  basicMiddleware,
  () => () => 'Hello! I'm compressed!'
)
.listen(8080)
.then(() => console.log('Listening to 8080'))
```

* Introduce isomorphic Views:

```javascript
// Server side
import { View } from 'ellie'

pipe(
  () => () => (<View component={IsomorphicReactComponent} propThatWillBePassedToComponent />)
)
```

```javascript
// Client side
import { View } from 'ellie'

View(IsomorphicReactComponent).mount()
```

* Add `embed` method on the Middleware class. It takes a list of middleware, and creates a new
  pipeline that starts with the middleware passed in, and then feeds into the next function
  of the current middleware.

```javascript
class AddsMiddlewareOnConditionMiddleware extends Middleware {
  pipe (request) {
    if (someCondition) {
      return this
        .embed(SomeOtherMiddleware, SomeThirdMiddleware)
        .pipe(request)
    }
    return this.next(request)
  }
}
```

* Add a transparent immutable key/value store on Requests and Responses

```javascript
const a = new Request('GET', '/')
console.log(a.thing) // undefined

const b = a.set('thing', 'value')
console.log(b.thing) // 'value'

const c = b.unset('thing')
console.log(c.thing) // undefined
```

* Add routing

```javascript
pipe(
  // Basic pages
  Route.get('/', () => () => 'This is the home screen'),
  Route.get('about', () => () => 'This is the about page'),

  // Methods
  Route.post('form', () => () => 'You posted a form'),

  // Nested routes and rest pattern
  Route.all('admin/...',
    Route.get('/', () => () => 'This is the admin screen'),
    Route.update('profile', () => () => 'Updating the profile')
  ),

  // Route parameters
  Route.get('pages/:id', () => (request) => `Page no. ${request.params.id}`),

  // Optional parameters
  Route.get('search/:term?', () => (request) => {
    const term = request.params.term || 'default'

    return `Searching for ${term}`
  }),

  // Optional trails
  Route.get('pages/index?' () => () => 'All pages')
)
```

* Add LoggerMiddleware to the basic middleware
* The body of a request is now available as a `body` property, parsed
  to an object if possible.
* Uploaded files are encapsulated in a class, exposing `save` and
  `saveWithOriginalName` methods.

```javascript
async function (request) {
  await request.body.myFileField.saveWithOriginalName('uploads')
  return Response.redirect(...)
}
```

# 0.2.1
* Bug fixes

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

* Expand on the Headers class, improve integration in the Server class.
* Add decorators to server, and introduce a few basic decorators
  for ensuring that the `next()` function always returns what you'd
  expect when in a server middleware.
* Add JSX support.
* Update the example to use JSX.
* Add compression middleware (opt-in)

```javascript
import { pipe, middleware } from 'ellie'

const pipeline = pipe(
  middleware.CompressionMiddleware,
  MyOtherMiddleware
)
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
