import { describe, it } from '../../../header'
import GetRequestBodyParser from 'ellie/src/server/http/requestBody/GetRequestBodyParser'
import Request from 'ellie/src/server/http/Request'

describe('GetRequestBodyParser', () => {
  const parser = new GetRequestBodyParser()

  describe('#queryString', () => {
    it('parses a query string to an object', () => {
      parser.queryString('key=value').should.deep.equal({ key: 'value' })
    })

    it('parses multiple key/values', () => {
      parser.queryString('a=x&b=y').should.deep.equal({
        a: 'x',
        b: 'y'
      })
    })

    it('overrides multiple of the same keys', () => {
      parser.queryString('a=x&a=y').should.deep.equal({
        a: 'y'
      })
    })

    it('decodes the URL encoded values', () => {
      parser.queryString('a%20b=c%20d').should.deep.equal({
        'a b': 'c d'
      })
    })
  })

  describe('#parse', () => {
    it('parses the query string of a request', () => {
      const request = new Request('GET', '/?key=value')
      parser.parse(request).should.deep.equal({ key: 'value' })
    })
  })
})
