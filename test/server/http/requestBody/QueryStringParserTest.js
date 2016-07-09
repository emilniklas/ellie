import { describe, it } from '../../../header'
import QueryStringParser from 'ellie/src/server/http/requestBody/QueryStringParser'

describe('QueryStringParser', () => {
  const parser = new QueryStringParser()

  describe('#parse', () => {
    it('parses a query string to an object', () => {
      parser.parse('key=value').should.deep.equal({ key: 'value' })
    })

    it('parses multiple key/values', () => {
      parser.parse('a=x&b=y').should.deep.equal({
        a: 'x',
        b: 'y'
      })
    })

    it('overrides multiple of the same keys', () => {
      parser.parse('a=x&a=y').should.deep.equal({
        a: 'y'
      })
    })

    it('decodes the URL encoded values', () => {
      parser.parse('a%20b=c%20d').should.deep.equal({
        'a b': 'c d'
      })
    })

    it('works with non-spec PHP style multi key syntax', () => {
      parser.parse('a[]=x&a[]=y').should.deep.equal({
        a: ['x', 'y']
      })
    })
  })
})
