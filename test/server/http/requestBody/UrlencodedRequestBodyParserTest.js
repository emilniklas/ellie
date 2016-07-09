import { describe, it } from '../../../header'
import UrlencodedRequestBodyParser from 'ellie/src/server/http/requestBody/UrlencodedRequestBodyParser'
import { Readable } from 'stream'

describe('UrlencodedRequestBodyParser', () => {
  const parser = new UrlencodedRequestBodyParser()

  describe('#parse', () => {
    it('receives a readable string and parses Urlencoded', async function () {
      const stream = new Readable()
      stream.push('k=v')
      stream.push(null)

      await parser.parse(stream).should.eventually.deep.equal({ k: 'v' })
    })
  })
})
