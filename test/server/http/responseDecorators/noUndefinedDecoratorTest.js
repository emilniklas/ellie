import { describe, it } from '../../../header'
import noUndefinedDecorator from 'ellie/src/server/http/responseDecorators/noUndefinedDecorator'

describe('noUndefinedDecorator', () => {
  it('does nothing to values', () => {
    noUndefinedDecorator(123).should.equal(123)
    noUndefinedDecorator('hello').should.equal('hello')
  })

  it('throws a TypeError if it receives undefined', () => {
    ;(() => noUndefinedDecorator()).should.throw(TypeError)
  })
})
