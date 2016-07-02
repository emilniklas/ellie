import { describe, it } from '../../../header'
import toStringDecorator from 'ellie/src/server/http/responseDecorators/toStringDecorator'
import Response from 'ellie/src/server/http/Response'

describe('toStringDecorator', () => {
  it('does nothing to a response', () => {
    const response = Response.ok('hello')
    toStringDecorator(response).should.equal(response)
  })

  it('converts other types to basic string responses', () => {
    toStringDecorator('hello').body.should.equal('hello')
    toStringDecorator(123).body.should.equal('123')
  })

  const assertJSONResponse = (response, body) => {
    response.headers.get('Content-Type').should.equal('application/json')
    response.body.should.equal(body)
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
