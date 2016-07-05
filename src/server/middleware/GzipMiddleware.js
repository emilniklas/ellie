import HttpEncoderMiddleware from './HttpEncoderMiddleware'
import { createGzip } from 'zlib'

export default class GzipMiddleware extends HttpEncoderMiddleware {
  static encoding () {
    return 'gzip'
  }

  static encoder () {
    return createGzip()
  }
}
