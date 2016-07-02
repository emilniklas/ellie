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

  it('transforms JSX into a response', async function () {
    await jsxDecorator(
      <html>
        <head />
        <body>
          <div>Hello World</div>
        </body>
      </html>
    ).body.buffer().should.eventually.equal(helloWorldBody)
  })

  it('always adds the root html tags', async function () {
    await jsxDecorator(
      <body>
        <div>Hello World</div>
      </body>
    ).body.buffer().should.eventually.equal(helloWorldBody)

    await jsxDecorator(
      <div>Hello World</div>
    ).body.buffer().should.eventually.equal(helloWorldBody)
  })
})
