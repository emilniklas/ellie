import { describe, it } from '../../header'
import ContentType from 'ellie/src/server/http/ContentType'

describe('ContentType', () => {
  describe('#toString', () => {
    it('makes a valid content-type header', () => {
      new ContentType('text', 'plain')
        .toString().should.equal('text/plain')
    })

    it('can have a charset', () => {
      new ContentType('text', 'plain', 'utf-8')
        .toString().should.equal('text/plain; charset=utf-8')
    })
  })

  describe('static presets', () => {
    it('has a plain text preset', () => {
      ContentType.TEXT.toString()
        .should.equal('text/plain; charset=utf-8')
    })

    it('has an html preset', () => {
      ContentType.HTML.toString()
        .should.equal('text/html; charset=utf-8')
    })

    it('has a JSON preset', () => {
      ContentType.JSON.toString()
        .should.equal('application/json; charset=utf-8')
    })
  })
})
