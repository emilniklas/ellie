import { describe, it } from '../header'

import Pipeline from 'ellie/src/pipeline/Pipeline'
import Middleware from 'ellie/src/pipeline/Middleware'
import NoResponseError from 'ellie/src/pipeline/NoResponseError'

describe('Pipeline', () => {
  describe('with no middleware', () => {
    const pipeline = new Pipeline([])

    it('throws an error', async function () {
      await pipeline.pipe()
        .should.be.rejectedWith(NoResponseError)
    })
  })

  describe('with one middleware that does not return a response', () => {
    const pipeline = new Pipeline([
      (next) => () => next()
    ])

    it('throws an error', async function () {
      await pipeline.pipe()
        .should.be.rejectedWith(NoResponseError)
    })
  })

  describe('with one middleware that does return a response', () => {
    const pipeline = new Pipeline([
      () => () => 'response'
    ])

    it('resolves to the response', async function () {
      await pipeline.pipe()
        .should.eventually.equal('response')
    })
  })

  describe("with a class style middleware that doesn't extend Middleware", () => {
    it('throws an error', () => {
      ;(() => new Pipeline([ class {} ]))
        .should.throw(TypeError)
    })
  })

  describe('with a class style middleware that does extend Middleware', () => {
    it('does not throw an error', () => {
      ;(() => new Pipeline([ class extends Middleware {} ]))
        .should.not.throw(TypeError)
    })
  })

  describe('with a pipeline', () => {
    const pipeline = new Pipeline([
      (next) => (request) => next(request),
      class extends Middleware {},
      () => (request) => request
    ])

    it('pipes the request as a response back through the pipeline', async function () {
      await pipeline.pipe('request')
        .should.eventually.equal('request')
    })
  })

  it('passes acceptance', async function () {
    const squareRequestMiddleware =
      (next) => (request) => next(request * 2)

    class UppercaseResponseMiddleware extends Middleware {
      async pipe (request) {
        const response = await this.next(request)
        return response.toUpperCase()
      }
    }

    const responseMiddleware =
      () => (request) => request > 5
        ? 'greater than 5'
        : 'less or equal to 5'

    const pipeline = new Pipeline([
      squareRequestMiddleware,
      UppercaseResponseMiddleware,
      responseMiddleware
    ])

    await pipeline.pipe(2).should.eventually.equal('LESS OR EQUAL TO 5')
    await pipeline.pipe(3).should.eventually.equal('GREATER THAN 5')
  })
})
