import { describe, it } from '../../../header'
import RequestBodyParser from 'ellie/src/server/http/requestBody/RequestBodyParser'
import Request from 'ellie/src/server/http/Request'

describe('RequestBodyParser', () => {
  const parser = new RequestBodyParser()

  describe('#parse', () => {
    it('delegates to the correct parser given the method', () => {
      const request = new Request('GET', '/?key=value')
      parser.parse(request).should.deep.equal({ key: 'value' })
    })
  })
})
