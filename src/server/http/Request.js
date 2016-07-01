import Headers from './Headers'

export default class Request {
  constructor (method, url, headers) {
    this.method = method
    this.url = url
    this.headers = headers || new Headers()
  }
}
