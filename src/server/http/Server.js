import Request from './Request'
import Response from './Response'
import Headers from './Headers'
import NoResponseError from '../../pipeline/NoResponseError'
import RequestBodyParser from './requestBody/RequestBodyParser'

export default class Server {
  constructor (pipeline, listenerFactory) {
    this._pipeline = pipeline
    this._handler = this._handler.bind(this)
    this._listenerFactory = listenerFactory
    this._listener = listenerFactory(this._handler)
    this._requestBodyParser = new RequestBodyParser()
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
    const headers = Object.keys(nativeRequest.headers)
      .map((name) => [ name, nativeRequest.headers[name] ])
      .reduce(
        (headers, [name, value]) => headers.set(name, value),
        new Headers()
      )
    const request = new Request(nativeRequest.method, nativeRequest.url, headers)
    return request.set('body', this._requestBodyParser.parse(request))
  }

  _writeResponse (response, nativeResponse) {
    response.headers.forEach(nativeResponse.setHeader.bind(nativeResponse))
    nativeResponse.writeHead(response.statusCode)
    response.body.pipe(nativeResponse)
  }

  _errorResponse (error) {
    if (error instanceof NoResponseError) {
      return new Response(404, 'Not Found')
    }
    const statusCode = error.statusCode || 500
    return new Response(statusCode, error.stack)
  }
}
