import Request from './Request'
import Response from './Response'
import NoResponseError from '../../pipeline/NoResponseError'

export default class Server {
  constructor (pipeline, listenerFactory) {
    this._pipeline = pipeline
    this._handler = this._handler.bind(this)
    this._listenerFactory = listenerFactory
    this._listener = listenerFactory(this._handler)
  }

  listen (port, hostname = '0.0.0.0') {
    return new Promise((resolve) => {
      this._listener.listen(port, hostname, resolve)
    })
  }

  decorate (...decorators) {
    return new Server(
      this._pipeline.decorate(...decorators),
      this._listenerFactory
    )
  }

  request (method, url) {
    return this._pipeline.pipe(new Request(method, url))
  }

  async _handler (nativeRequest, nativeResponse) {
    const request = this._parseRequest(nativeRequest)
    try {
      const response = await this._pipeline.pipe(request)
      this._writeResponse(response, nativeResponse)
    } catch (e) {
      const response = this._errorResponse(e)
      this._writeResponse(response, nativeResponse)
    }
  }

  _parseRequest (nativeRequest) {
    return new Request(nativeRequest.method, nativeRequest.url)
  }

  _writeResponse (response, nativeResponse) {
    nativeResponse.writeHead(response.statusCode)
    response.headers.forEach(nativeResponse.setHeader.bind(nativeResponse))
    nativeResponse.end(response.body)
  }

  _errorResponse (error) {
    if (error instanceof NoResponseError) {
      return new Response(404, 'Not Found')
    }
    const statusCode = error.statusCode || 500
    return new Response(statusCode, error.stack)
  }
}
