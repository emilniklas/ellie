import HttpEncoderMiddleware from './HttpEncoderMiddleware'
import { createGzip } from 'zlib'

export default class GzipMiddleware extends HttpEncoderMiddleware {
  encoding () {
    return 'gzip'
  }

  encoder () {
    return createGzip()
  }
}
