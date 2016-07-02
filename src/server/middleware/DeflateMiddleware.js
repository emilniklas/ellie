import HttpEncoderMiddleware from './HttpEncoderMiddleware'
import { createDeflate } from 'zlib'

export default class DeflateMiddleware extends HttpEncoderMiddleware {
  encoding () {
    return 'deflate'
  }

  encoder () {
    return createDeflate()
  }
}
