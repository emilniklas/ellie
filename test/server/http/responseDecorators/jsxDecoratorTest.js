import { describe, it } from '../../../header'
import jsxDecorator from 'ellie/src/server/http/responseDecorators/jsxDecorator'

describe('jsxDecorator', () => {
  it('does nothing to values', () => {
    jsxDecorator(123).should.equal(123)
    jsxDecorator('hello').should.equal('hello')
  })

  const helloWorldBody = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '</head>',
    '<body>',
    '<div>Hello World</div>',
    '</body>',
    '</html>'
  ].join('')

  it('transforms JSX into a response', () => {
    jsxDecorator(
      <html>
        <head />
        <body>
          <div>Hello World</div>
        </body>
      </html>
    ).body.should.equal(helloWorldBody)
  })

  it('always adds the root html tags', () => {
    jsxDecorator(
      <body>
        <div>Hello World</div>
      </body>
    ).body.should.equal(helloWorldBody)

    jsxDecorator(
      <div>Hello World</div>
    ).body.should.equal(helloWorldBody)
  })
})
