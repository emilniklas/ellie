import Middleware from '../../pipeline/Middleware'
import RouteValidator from './RouteValidator'
import { parse } from 'url'

export default class Route extends Middleware {
  constructor (next, method, url, middleware) {
    super(next)

    this._validator = new RouteValidator(method, url)

    this.method = method
    this.url = url

    this.pipeline = this.embed(middleware)
  }

  pipe (request) {
    const path = request._path == null ? parse(request.url).pathname : request._path
    if (this._validator.validate(request.method, path)) {
      return this.pipeline.pipe(
        request
          .set('params', this._validator.params(path))
          .set('_path', this._validator.path(path))
      )
    }
    return this.next(request)
  }

  static make (method, url, ...middleware) {
    return class extends Route {
      constructor (next) {
        super(next, method, url, middleware)
      }
    }
  }

  static get (url, ...middleware) {
    return this.make(/GET|HEAD/i, url, ...middleware)
  }

  static post (url, ...middleware) {
    return this.make(/POST/i, url, ...middleware)
  }

  static put (url, ...middleware) {
    return this.make(/PUT/i, url, ...middleware)
  }

  static patch (url, ...middleware) {
    return this.make(/PATCH/i, url, ...middleware)
  }

  static update (url, ...middleware) {
    return this.make(/UPDATE/i, url, ...middleware)
  }

  static delete (url, ...middleware) {
    return this.make(/DELETE/i, url, ...middleware)
  }

  static options (url, ...middleware) {
    return this.make(/OPTIONS/i, url, ...middleware)
  }

  static all (url, ...middleware) {
    return this.make(/./, url, ...middleware)
  }
}
