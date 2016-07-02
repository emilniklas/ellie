import NoResponseError from './NoResponseError'
import Middleware from './Middleware'

/**
 * Here, the pipeline is created.
 *
 *     MiddlewareA(MiddlewareB(MiddlewareC(end)))
 *
 * If decorators are supplied, they are placed in
 * between each middleware:
 *
 *     MA(D2(D1(MB(D2(D1(MC(end)))))))
 */
function makePipeline (middleware, decorators) {
  return middleware.reduceRight(glue(decorators), end)
}

/**
 * A middleware can return anything, but when calling the
 * next one, we should always expect a decorated promise.
 *
 * This function created the reducer that applies [Promise.resolve]
 * and all the decorators to the response of every middleware before
 * passing it down to the previous one.
 */
function glue (decorators) {
  return (next, middleware) => {
    // Create the middleware, passing in the next, previously
    // normalized, middleware into the constructor/function.
    const middlewareInstance = instantiateMiddleware(next, middleware)

    // This function will be passed into the preceding middleware,
    // as the [next] function. It should always be a Promise, with
    // the decorators applied to it.
    return (request) => {
      const nextMiddlewareResponse = middlewareInstance(request)
      return decorateResponse(nextMiddlewareResponse, decorators)
    }
  }
}

/**
 * By reducing over each decorator function, and passing it
 * to the [Promise#then] method, we end up with something
 * like this:
 *
 *     Promise.resolve(response)
 *       .then(decorator1)
 *       .then(decorator2)
 *       ...
 *       .then(decoratorN)
 */
function decorateResponse (response, decorators) {
  const promise = Promise.resolve(response)
  const reducer = (promise, decorator) => promise.then(decorator)
  return decorators.reduce(reducer, promise)
}

/**
 * The topmost middleware, which throws the error that no response
 * was ever created in the pipeline.
 */
async function end () {
  throw new NoResponseError()
}

/**
 * The [Pipeline.make] factory can take different kinds
 * of middleware. This function is responsible for initializing
 * each one, passing in the next one into its constructor or
 * outer function.
 */
function instantiateMiddleware (next, middleware) {
  // If the middleware is a nested pipeline, we
  // create a fork in the pipeline.
  if (middleware instanceof Pipeline) {
    return fork(next, middleware)
  }

  // First, we assume that the middleware is a function style
  // middleware. If running it as a function throws a [TypeError]
  // it is probably a class style middleware.
  try {
    return middleware(next)
  } catch (e) {
    // If the error isn't a [TypeError], we should rethrow it
    if (!(e instanceof TypeError)) {
      throw e
    }

    // At this point, we can assume that the middleware is a
    // class, so we instantiate it.
    return instantiateClassMiddleware(next, middleware)
  }
}

/**
 * The "pipeline middleware" runs the request through
 * the new pipeline. If the new one doesn't provide
 * a response, we keep going in the original pipeline.
 */
function fork (next, pipeline) {
  return async function (request) {
    try {
      // Send the request through the fork
      return await pipeline.pipe(request)
    } catch (e) {
      // If an error is thrown that isn't a [NoResponseError],
      // we should rethrow it.
      if (!(e instanceof NoResponseError)) {
        throw e
      }

      // Elsewise, try passing the request on through its
      // original pipeline.
      return next(request)
    }
  }
}

/**
 * A class style middleware should look like this:
 *
 *     class SomeMiddleware extends Middleware {
 *       constructor (next) {
 *         super(next)
 *         // Set up done once for each pipeline
 *       }
 *
 *       async pipe (request) {
 *         // Do whatever to the request
 *         const response = this.next(request)
 *         // Do whatever to the response
 *         return response
 *       }
 *     }
 */
function instantiateClassMiddleware (next, NextMiddleware) {
  // Create the instance
  const instance = new NextMiddleware(next)

  // If it doesn't extend [Middleware], we can't really
  // enforce the existance of a [pipe] method, so we
  // force it.
  if (!(instance instanceof Middleware)) {
    const name = NextMiddleware.name === ''
      ? 'Anonymous class middleware'
      : NextMiddleware.name
    throw new TypeError(`${name} must extend the Middleware class`)
  }

  // Bind the instance's pipe method to its own lexical scope,
  // and send it back as the handler for this middleware.
  return instance.pipe.bind(instance)
}

export default class Pipeline {
  constructor (middleware, pipeline, decorators = []) {
    this._middleware = middleware
    this._pipeline = pipeline
    this._decorators = decorators
  }

  static make (middleware, decorators = []) {
    return new Pipeline(
      middleware,
      makePipeline(middleware, decorators),
      decorators
    )
  }

  pipe (request) {
    return this._pipeline(request)
  }

  decorate (...decorators) {
    return Pipeline.make(
      this._middleware,
      this._decorators.concat(decorators)
    )
  }
}
