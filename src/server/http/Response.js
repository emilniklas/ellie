import Headers from './Headers'

export default class Response {
  constructor (statusCode, body, headers) {
    this.statusCode = statusCode
    this.body = body
    this.headers = headers || new Headers()
  }

  static ok (body) {
    return new Response(200, body)
  }
}
