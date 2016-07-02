import { describe, it } from '../../../header'
import toStringDecorator from 'ellie/src/server/http/responseDecorators/toStringDecorator'
import Response from 'ellie/src/server/http/Response'

describe('toStringDecorator', () => {
  it('does nothing to a response', () => {
    const response = Response.ok('hello')
    toStringDecorator(response).should.equal(response)
  })

  it('converts other types to basic string responses', async function () {
    await toStringDecorator('hello').body.buffer().should.eventually.equal('hello')
    await toStringDecorator(123).body.buffer().should.eventually.equal('123')
  })

  const assertJSONResponse = async function (response, body) {
    response.headers.get('Content-Type').should.equal('application/json; charset=utf-8')
    await response.body.buffer().should.eventually.equal(body)
  }

  it('converts objects and arrays to JSON', () => {
    assertJSONResponse(
      toStringDecorator({}),
      '{}'
    )
    assertJSONResponse(
      toStringDecorator([]),
      '[]'
    )
  })
})
