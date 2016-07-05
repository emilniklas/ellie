import HttpMessage from './HttpMessage'

export default class Request extends HttpMessage {
  constructor (method, url, headers) {
    super(headers)

    this.method = method
    this.url = url
  }

  get _protected () {
    return super._protected.concat('method', 'url')
  }

  _copy () {
    return new Request(
      this.method,
      this.url,
      this.headers
    )
  }
}
