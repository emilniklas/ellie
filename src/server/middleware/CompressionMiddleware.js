import GzipMiddleware from './GzipMiddleware'
import DeflateMiddleware from './DeflateMiddleware'

export default function CompressionMiddleware (next) {
  const gzip = new GzipMiddleware(next)
  const deflate = new DeflateMiddleware(next)
  return (request) => {
    if (gzip.canEncode(request)) {
      return gzip.pipe(request)
    }

    if (deflate.canEncode(request)) {
      return deflate.pipe(request)
    }

    return next(request)
  }
}
