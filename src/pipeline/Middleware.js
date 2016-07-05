import Pipeline from './Pipeline'

export default class Middleware {
  constructor (next) {
    this.next = next
  }

  pipe (request) {
    return this.next(request)
  }

  embed (...middleware) {
    return Pipeline.make(middleware, this.next.__decorators || [])
      .then(this.next)
  }
}
