import HttpMessage from './HttpMessage'
import ContentType from './ContentType'
import ResponseBody from './ResponseBody'

/**
 * An HTTP Response message.
 */
export default class Response extends HttpMessage {
  constructor (statusCode, body, headers) {
    super(headers)

    this.statusCode = statusCode
    this.body = new ResponseBody(body)
  }

  /**
   * Creates a simple 200 HTML response.
   *
   * @param body
   * @returns {Response}
   */
  static ok (body) {
    return new Response(200, body)
      .header('Content-Type', ContentType.HTML)
  }

  /**
   * Creates a simple JSON response.
   *
   * @param body
   * @param {Number} status
   * @returns {Response}
   */
  static json (body, status = 200) {
    return new Response(status, JSON.stringify(body))
      .header('Content-Type', ContentType.JSON)
  }

  /**
   * Creates a simple 301 permanent redirect response.
   *
   * @param {String} location
   * @returns {Response}
   */
  static moved (location) {
    return new Response(301, `Moved Permanently: ${location}`)
      .location(location)
  }

  /**
   * Creates a simple 302 redirect response.
   *
   * @param {String} location
   * @returns {Response}
   */
  static found (location) {
    return new Response(302, `Found: ${location}`)
      .location(location)
  }

  /**
   * Creates a simple 303 redirect response.
   *
   * @param {String} location
   * @returns {Response}
   */
  static redirect (location) {
    return new Response(303, `See Other: ${location}`)
      .location(location)
  }

  /**
   * Changes the status code of the response.
   *
   * @param {Number} code
   * @returns {Response}
   */
  status (code) {
    if (code == null) {
      return this.statusCode
    }
    return new Response(
      code,
      this.body,
      this.headers
    )
  }

  /**
   * Changes the body of the response.
   *
   * @param body
   * @returns {Response}
   */
  changeBody (body) {
    return new Response(
      this.statusCode,
      body,
      this.headers
    )
  }

  /**
   * Gets or sets a header.
   *
   * @param {String} name
   * @param {String?} value
   * @returns {String|Response}
   */
  header (name, value) {
    if (value == null) {
      return this.headers.get(name)
    }
    return new Response(
      this.statusCode,
      this.body,
      this.headers.set(name, value)
    )
  }

  /**
   * Clears a header.
   *
   * @param {String} name
   * @returns {Response}
   */
  clearHeader (name) {
    return new Response(
      this.statusCode,
      this.body,
      this.headers.clear(name)
    )
  }

  /**
   * Sets the Content-Type header.
   *
   * @param {ContentType|String} value
   * @returns {Response}
   */
  contentType (value) {
    return this
      .clearHeader('Content-Type')
      .header('Content-Type', value)
  }

  _copy () {
    return new Response(
      this.statusCode,
      this.body,
      this.headers
    )
  }

  get _protected () {
    return super._protected.concat('statusCode', 'body')
  }
}
