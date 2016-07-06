import CompressionMiddleware from './CompressionMiddleware'
import DeflateMiddleware from './DeflateMiddleware'
import GzipMiddleware from './GzipMiddleware'
import HttpEncoderMiddleware from './HttpEncoderMiddleware'
import LoggerMiddleware from './LoggerMiddleware'

export {
  CompressionMiddleware,
  DeflateMiddleware,
  GzipMiddleware,
  HttpEncoderMiddleware,
  LoggerMiddleware
}

export default [
  LoggerMiddleware,
  CompressionMiddleware
]
