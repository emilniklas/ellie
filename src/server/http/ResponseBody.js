import { Readable } from 'stream'

export default class ResponseBody extends Readable {
  constructor (body) {
    super({})
    this._body = String(body)
    if (body instanceof Readable) {
      this._read = body._read.bind(body)
      this.on = body.on.bind(body)
      if (body instanceof ResponseBody) {
        this.toString = body.toString.bind(body)
      } else {
        this.toString = () => 'ResponseBody<?>' + body
      }
    }
  }

  _read (size) {
    size = size || 1000
    while (true) {
      const chunk = this._body.slice(0, size)
      this._body = this._body.slice(size)

      if (chunk === '') {
        this.push(null)
        break
      }
      if (!this.push(new Buffer(chunk))) {
        break
      }
    }
  }

  buffer () {
    return new Promise((resolve, reject) => {
      let buffer = ''
      this.on('readable', () => {
        this.read()
      })
      this.on('data', (chunk) => {
        buffer += chunk.toString()
      })
      this.on('end', () => {
        resolve(buffer)
      })
      this.on('error', (error) => {
        reject(error)
      })
    })
  }

  toString () {
    return `ResponseBody<${this._body.length}>`
  }
}
