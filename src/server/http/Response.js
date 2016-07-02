import Headers from './Headers'
import ContentType from './ContentType'

export default class Response {
  constructor (statusCode, body, headers) {
    this.statusCode = statusCode
    this.body = body
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
}
