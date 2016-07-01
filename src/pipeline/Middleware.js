export default class Middleware {
  constructor (next) {
    this.next = next
  }

  pipe (request) {
    return this.next(request)
  }
}
