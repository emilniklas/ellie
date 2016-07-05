import Middleware from '../../pipeline/Middleware'

export default class PipeResponseStreamMiddleware extends Middleware {
  async pipe (request) {
    if (!this.constructor.canEncode(request)) {
      return this.next(request)
    }

    const response = await this.next(request)
    return response.changeBody(
      response.body.pipe(this.constructor.encoder())
    ).header('Content-Encoding', this.constructor.encoding())
  }

  static canEncode (request) {
    const accepts = request.headers.get('Accept-Encoding')
    return new RegExp(this.encoding(), 'i').test(accepts)
  }

  static encoding () {
    throw new Error('Implement this method')
  }

  static encoder () {
    throw new Error('Implement this method')
  }
}
