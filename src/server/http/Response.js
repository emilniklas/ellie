import Headers from './Headers'
import ContentType from './ContentType'
import ResponseBody from './ResponseBody'

export default class Response {
  constructor (statusCode, body, headers) {
    this.statusCode = statusCode
    this.body = new ResponseBody(body)
    this.headers = headers || new Headers()
  }

  static ok (body) {
    return new Response(200, body)
      .header('Content-Type', ContentType.HTML)
  }

  static json (body, status = 200) {
    return new Response(status, JSON.stringify(body))
      .header('Content-Type', ContentType.JSON)
  }

  static moved (location) {
    return new Response(301, `Moved Permanently: ${location}`)
      .location(location)
  }

  static found (location) {
    return new Response(302, `Found: ${location}`)
      .location(location)
  }

  static redirect (location) {
    return new Response(303, `See Other: ${location}`)
      .location(location)
  }

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

  clearHeader (name) {
    return new Response(
      this.statusCode,
      this.body,
      this.headers.clear(name)
    )
  }

  contentType (value) {
    return this
      .clearHeader('Content-Type')
      .header('Content-Type', value)
  }

  redirect (url, status = 303) {
    return this
      .status(status)
      .clearHeader('Location')
      .header('Location', url)
  }
}
