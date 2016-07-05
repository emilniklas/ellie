import HttpEncoderMiddleware from './HttpEncoderMiddleware'
import { createDeflate } from 'zlib'

export default class DeflateMiddleware extends HttpEncoderMiddleware {
  static encoding () {
    return 'deflate'
  }

  static encoder () {
    return createDeflate()
  }
}
