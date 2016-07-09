import { describe, it } from '../../../header'
import RequestBodyParser from 'ellie/src/server/http/requestBody/RequestBodyParser'
import Request from 'ellie/src/server/http/Request'
import { Readable } from 'stream'

const readStream = (stream) => {
  return new Promise((resolve) => {
    let chunks = []
    stream.on('data', (buffer) => {
      chunks.push(buffer.toString())
    })
    stream.on('end', () => {
      resolve(chunks.join(''))
    })
  })
}

describe('RequestBodyParser', () => {
  const parser = new RequestBodyParser()

  describe('#parse', () => {
    it('delegates to the correct parser given the method', async function () {
      const request = new Request('GET', '/?key=value')
      await parser.parse(request).should.eventually.deep.equal({ key: 'value' })
    })

    it('simply reads the body if it has no parser', async function () {
      const stream = new Readable()
      stream.push('Some text')
      stream.push(null)

      const request = new Request('POST', '/')
      const body = await parser.parse(request, stream)

      await readStream(body).should.eventually.deep.equal('Some text')
    })
  })
})
