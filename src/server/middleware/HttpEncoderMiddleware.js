import Middleware from '../../pipeline/Middleware'

export default class PipeResponseStreamMiddleware extends Middleware {
  async pipe (request) {
    if (!this.canEncode(request)) {
      return this.next(request)
    }

    const response = await this.next(request)
    return response.changeBody(
      response.body.pipe(this.encoder())
    ).header('Transfer-Encoding', this.encoding())
  }

  canEncode (request) {
    const accepts = request.headers.get('Accept-Encoding')
    return new RegExp(this.encoding(), 'i').test(accepts)
  }

  encoding () {
    throw new Error('Implement this method')
  }

  encoder () {
    throw new Error('Implement this method')
  }
}
