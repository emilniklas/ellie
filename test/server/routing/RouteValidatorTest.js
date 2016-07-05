import { describe, it } from '../../header'
import RouteValidator from 'ellie/src/server/routing/RouteValidator'

describe('RouteValidator', () => {
  describe('#validate', () => {
    it('tests whether or not a given URL matches a pattern', () => {
      const validator = new RouteValidator(/GET/, '/')
      validator.validate('GET', '/').should.be.ok
      validator.validate('POST', '/').should.not.be.ok
      validator.validate('GET', '/z').should.not.be.ok
    })

    it('ignores a leading or trailing slash', () => {
      const a = new RouteValidator(/GET/, 'hello')
      a.validate('GET', 'hello').should.be.ok
      a.validate('GET', '/hello').should.be.ok
      a.validate('GET', 'hello/').should.be.ok
      a.validate('GET', '/hello/').should.be.ok
      a.validate('GET', '///hello//').should.be.ok

      const b = new RouteValidator(/GET/, '/hello/')
      b.validate('GET', 'hello').should.be.ok
      b.validate('GET', '/hello').should.be.ok
      b.validate('GET', 'hello/').should.be.ok
      b.validate('GET', '/hello/').should.be.ok
      b.validate('GET', '///hello//').should.be.ok
    })

    it('knows about route params', () => {
      const validator = new RouteValidator(/GET/, 'hello/:param')
      validator.validate('GET', '/hello/value').should.be.ok
      validator.validate('GET', '/hello/other').should.be.ok
      validator.validate('GET', '/hello').should.not.be.ok
    })

    it('knows about optional route params', () => {
      const a = new RouteValidator(/GET/, 'hello/:a/:b?')
      a.validate('GET', '/hello/value').should.be.ok
      a.validate('GET', '/hello/other/value').should.be.ok
      a.validate('GET', '/hello').should.not.be.ok

      const b = new RouteValidator(/GET/, 'hello/:a/b?')
      b.validate('GET', '/hello/value').should.be.ok
      b.validate('GET', '/hello/other/value').should.not.be.ok
      b.validate('GET', '/hello/other/b').should.be.ok
      b.validate('GET', '/hello').should.not.be.ok
    })

    it('knows about rest marker', () => {
      const validator = new RouteValidator(/GET/, 'hello/...')
      validator.validate('GET', '/hello').should.be.ok
      validator.validate('GET', '/hello_more').should.not.be.ok
      validator.validate('GET', '/hello/more').should.be.ok
    })
  })

  describe('#params', () => {
    it('returns an empty object for invalid URLs', () => {
      const validator = new RouteValidator(/GET/, 'hello/:a')
      validator.params('hello').should.deep.equal({})
      validator.params('hello/x/x').should.deep.equal({})
    })

    it('returns an object describing the params passed in the URL', () => {
      const validator = new RouteValidator(/GET/, 'hello/:a')
      validator.params('hello/x').should.deep.equal({ a: 'x' })
      validator.params('hello/y').should.deep.equal({ a: 'y' })
    })

    it('works with multiple params', () => {
      const validator = new RouteValidator(/GET/, 'hello/:a/x/:b')
      validator.params('hello/a/x/b').should.deep.equal({ a: 'a', b: 'b' })
      validator.params('hello/c/x/d').should.deep.equal({ a: 'c', b: 'd' })
    })

    it('works with optional params', () => {
      const validator = new RouteValidator(/GET/, 'hello/:a/x/:b?')
      validator.params('hello/a/x/b').should.deep.equal({ a: 'a', b: 'b' })
      validator.params('hello/c/x').should.deep.equal({ a: 'c', b: void 0 })
    })

    it('works with optional segments', () => {
      const validator = new RouteValidator(/GET/, 'hello/:a/x/b?')
      validator.params('hello/a/x/b').should.deep.equal({ a: 'a', b: true })
      validator.params('hello/c/x').should.deep.equal({ a: 'c', b: false })
    })
  })

  describe('#path', () => {
    it('returns an empty string for degenerate cases', () => {
      const validator = new RouteValidator(/GET/, 'hello/there')
      validator.path('hello/there').should.equal('')
      validator.path('mismatch').should.equal('')
      validator.path('hello/there/too/much').should.equal('')
    })

    it('returns the excess path from a url', () => {
      const validator = new RouteValidator(/GET/, 'hello/...')
      validator.path('hello').should.equal('')
      validator.path('hello/more').should.equal('more')
      validator.path('hello/much/much/more').should.equal('much/much/more')
    })
  })
})
