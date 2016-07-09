import { Readable } from 'stream'

/**
 * A stream of data, representing the HTTP response's
 * body. It implements the native Readable stream,
 * so it can be piped directly to Node's
 * native response object (which is writable)
 */
export default class ResponseBody extends Readable {
  constructor (body) {
    super({})
    this._body = String(body)

    // If the body itself is a stream, we simply
    // delegate the stream API to the body.
    if (body instanceof Readable) {
      this._read = body._read.bind(body)
      this.on = body.on.bind(body)
      this.toString = () => `ResponseBody<${body}>`
    }

    // If the body is already a ResponseBody then the
    // previous if statement covers the streaming
    // delegation. Here we just delegate the toString
    // method as well, of else it will show the wrong
    // payload length.
    if (body instanceof ResponseBody) {
      this.toString = body.toString.bind(body)
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

  /**
   * Node's Stream API is bullsh*t, so here we
   * create a handy method for turning is to a simple
   * buffer.
   *
   * @returns {Promise<Buffer>}
   */
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
