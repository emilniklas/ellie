import { describe, it } from '../header'

import Pipeline from 'ellie/src/pipeline/Pipeline'
import Middleware from 'ellie/src/pipeline/Middleware'
import NoResponseError from 'ellie/src/pipeline/NoResponseError'

describe('Pipeline', () => {
  describe('with no middleware', () => {
    const pipeline = Pipeline.make([])

    it('throws an error', async function () {
      await pipeline.pipe()
        .should.be.rejectedWith(NoResponseError)
    })
  })

  describe('with one middleware that does not return a response', () => {
    const pipeline = Pipeline.make([
      (next) => () => next()
    ])

    it('throws an error', async function () {
      await pipeline.pipe()
        .should.be.rejectedWith(NoResponseError)
    })
  })

  describe('with one middleware that does return a response', () => {
    const pipeline = Pipeline.make([
      () => () => 'response'
    ])

    it('resolves to the response', async function () {
      await pipeline.pipe()
        .should.eventually.equal('response')
    })
  })

  describe("with a class style middleware that doesn't extend Middleware", () => {
    it('throws an error', () => {
      ;(() => Pipeline.make([ class {} ]))
        .should.throw(TypeError)
    })
  })

  describe('with a class style middleware that does extend Middleware', () => {
    it('does not throw an error', () => {
      ;(() => Pipeline.make([ class extends Middleware {} ]))
        .should.not.throw(TypeError)
    })
  })

  describe('with a pipeline', () => {
    const pipeline = Pipeline.make([
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

    const pipeline = Pipeline.make([
      squareRequestMiddleware,
      UppercaseResponseMiddleware,
      responseMiddleware
    ])

    await pipeline.pipe(2).should.eventually.equal('LESS OR EQUAL TO 5')
    await pipeline.pipe(3).should.eventually.equal('GREATER THAN 5')
  })

  it('can be composed in a list of middleware', async function () {
    const pipeline = Pipeline.make([
      Pipeline.make([ (n) => (r) => n(r).then((res) => res + '!') ]),
      Pipeline.make([ () => () => 'b' ])
    ])

    await pipeline.pipe().should.eventually.equal('b!')
  })

  it('can be passed decorators that decorate the responses from middleware', async function () {
    const pipeline = Pipeline.make([
      (next) => async function (request) {
        const response = await next(request)
        response.should.equal('124')
        return response
      },
      () => (request) => request
    ]).decorate((r) => r.replace('3', '4'), String)

    await pipeline.pipe(123)
  })

  it('can be connected to another pipeline', async function () {
    const a = Pipeline.make([
      (next) => (request) => next(request)
        .then((response) => response.toUpperCase())
    ])

    const b = Pipeline.make([
      () => (request) => request + '!'
    ])

    const c = a.join(b)

    await c.pipe('hello').should.eventually.equal('HELLO!')
  })

  it('can be attached to an active middleware', async function () {
    const pipeline = Pipeline.make([
      (next) => (request) => next(request)
        .then((response) => response.toUpperCase())
    ])

    const next = (request) => Promise.resolve(request + '!')

    const attached = pipeline.then(next)

    await attached.pipe('hello').should.eventually.equal('HELLO!')
  })
})
