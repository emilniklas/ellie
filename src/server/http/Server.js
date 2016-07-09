import Request from './Request'
import Response from './Response'
import Headers from './Headers'
import NoResponseError from '../../pipeline/NoResponseError'
import RequestBodyParser from './requestBody/RequestBodyParser'

/**
 * The main HTTP server class. It uses the native NodeJS
 * 'http' interfaces and maps them over to Ellie's own
 * Request objects.
 *
 * It then sends the request through the supplied pipeline,
 * expecting a Response object in return. It writes the response
 * to the native response object, and ends the cycle.
 *
 * Simple as that.
 */
export default class Server {
  /**
   * For testing purposes, this constructor receives
   * Node's createServer factory function in this
   * constructor. Think of the "listenerFactory" as
   * an alias of createServer.
   */
  constructor (pipeline, listenerFactory) {
    this._pipeline = pipeline
    this._handler = this._handler.bind(this)
    this._listenerFactory = listenerFactory
    this._listener = listenerFactory(this._handler)
    this._requestBodyParser = new RequestBodyParser()
  }

  /**
   * Starts listening to a port on the host.
   *
   * @param {Number} port
   * @param {String?} hostname
   * @returns {Promise}
   */
  listen (port, hostname = '0.0.0.0') {
    return new Promise((resolve) => {
      this._listener.listen(port, hostname, resolve)
    })
  }

  /**
   * Adds decorators to the underlying pipeline.
   *
   * @param {[Object -> Response]} ...decorators
   * @returns {Server}
   */
  decorate (...decorators) {
    return new Server(
      this._pipeline.decorate(...decorators),
      this._listenerFactory
    )
  }

  /**
   * Artificially sends a Request object through
   * the pipeline, returning the response.
   *
   * @param {String} method
   * @param {String} url
   * @returns {Promise<Response>}
   */
  request (method, url) {
    return this._pipeline.pipe(new Request(method, url))
  }

  async _handler (nativeRequest, nativeResponse) {
    const request = await this._parseRequest(nativeRequest)
    try {
      const response = await this._pipeline.pipe(request)
      this._writeResponse(response, nativeResponse)
    } catch (e) {
      const response = this._errorResponse(e)
      this._writeResponse(response, nativeResponse)
    }
  }

  async _parseRequest (nativeRequest) {
    const headers = Object.keys(nativeRequest.headers)
      .map((name) => [ name, nativeRequest.headers[name] ])
      .reduce(
        (headers, [name, value]) => headers.set(name, value),
        new Headers()
      )
    const request = new Request(nativeRequest.method, nativeRequest.url, headers)
    return request.set('body', await this._requestBodyParser.parse(request, nativeRequest))
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
