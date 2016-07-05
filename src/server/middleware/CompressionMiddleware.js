import GzipMiddleware from './GzipMiddleware'
import DeflateMiddleware from './DeflateMiddleware'
import Middleware from '../../pipeline/Middleware'

export default class CompressionMiddleware extends Middleware {
  constructor (next) {
    super(next)

    this.gzip = this.embed(GzipMiddleware)
    this.deflate = this.embed(DeflateMiddleware)
  }

  pipe (request) {
    if (GzipMiddleware.canEncode(request)) {
      return this.gzip.pipe(request)
    }

    if (DeflateMiddleware.canEncode(request)) {
      return this.deflate.pipe(request)
    }

    return this.next(request)
  }
}
