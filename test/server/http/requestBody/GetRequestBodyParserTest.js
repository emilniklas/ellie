import { describe, it } from '../../../header'
import GetRequestBodyParser from 'ellie/src/server/http/requestBody/GetRequestBodyParser'
import Request from 'ellie/src/server/http/Request'

describe('GetRequestBodyParser', () => {
  const parser = new GetRequestBodyParser()

  describe('#parse', () => {
    it('parses the query string of a request', async function () {
      const request = new Request('GET', '/?key=value')
      await parser.parse(request).should.eventually.deep.equal({ key: 'value' })
    })
  })
})
