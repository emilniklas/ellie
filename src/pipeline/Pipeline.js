import NoResponseError from './NoResponseError'
import Middleware from './Middleware'

export default class Pipeline {
  constructor (middleware) {
    this._glue = this._glue.bind(this)
    this._end = this._end.bind(this)

    this._pipeline = this._makePipeline(middleware)
  }

  pipe (request) {
    return this._pipeline(request)
  }

  _makePipeline (middleware) {
    return middleware.reduceRight(this._glue, this._end)
  }

  _glue (next, middleware) {
    const middlewareInstance = this._instantiateMiddleware(next, middleware)
    return (request) => {
      return Promise.resolve(middlewareInstance(request))
    }
  }

  _instantiateMiddleware (next, middleware) {
    if (middleware instanceof Pipeline) {
      return this._pipelineMiddleware(next, middleware)
    }
    try {
      return middleware(next)
    } catch (e) {
      if (!(e instanceof TypeError)) {
        throw e
      }
      return this._instantiateClassMiddleware(next, middleware)
    }
  }

  _pipelineMiddleware (next, pipeline) {
    return async function (request) {
      try {
        return await pipeline.pipe(request)
      } catch (e) {
        if (e instanceof NoResponseError) {
          return next(request)
        }
        throw e
      }
    }
  }

  _instantiateClassMiddleware (next, NextMiddleware) {
    const instance = new NextMiddleware(next)

    if (!(instance instanceof Middleware)) {
      const name = NextMiddleware.name === ''
        ? 'Anonymous class middleware'
        : NextMiddleware.name
      throw new TypeError(`${name} must extend the Middleware class`)
    }

    return instance.pipe.bind(instance)
  }

  async _end () {
    throw new NoResponseError()
  }
}
