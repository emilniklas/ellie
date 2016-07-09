import { describe, it } from '../../../header'
import JSONRequestBodyParser from 'ellie/src/server/http/requestBody/JSONRequestBodyParser'
import { Readable } from 'stream'

describe('JSONRequestBodyParser', () => {
  const parser = new JSONRequestBodyParser()

  describe('#parse', () => {
    it('receives a readable string and parses JSON', async function () {
      const stream = new Readable()
      stream.push('{"k":"v"}')
      stream.push(null)

      await parser.parse(stream).should.eventually.deep.equal({ k: 'v' })
    })
  })
})
