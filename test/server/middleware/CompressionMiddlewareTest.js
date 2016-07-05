import { describe, it } from '../../header'
import CompressionMiddleware from 'ellie/src/server/middleware/CompressionMiddleware'
import { Response, Request, Headers } from 'ellie/src/server'
import { gzipSync, deflateSync } from 'zlib'
import pipe from 'ellie/src/pipeline/pipe'

describe('CompressionMiddleware', () => {
  let pipeline = pipe(CompressionMiddleware)
    .then(() => Promise.resolve(Response.ok('x')))

  it("does nothing to a request that doesn't accept any encoding", async function () {
    const response = await pipeline.pipe(new Request('GET', '/'))
    await response.body.buffer().should.eventually.equal('x')
  })

  async function testCompression (encoder, encoding, expected = 'x') {
    const headers = new Headers()
      .set('Accept-Encoding', encoding)
    const request = new Request('GET', '/', headers)
    const response = await pipeline.pipe(request)
    await response.body.buffer().should.eventually.equal(encoder(expected).toString())
    response.header('Content-Encoding').should.equal(encoding)
  }

  it('gzip encodes the response body', async function () {
    await testCompression(gzipSync, 'gzip')
  })

  it('deflate encodes the response body', async function () {
    await testCompression(deflateSync, 'deflate')
  })

  it("inherits the pipeline's decorators", async function () {
    let wasRun = false
    pipeline = pipeline.decorate(function (x) {
      if (wasRun) { return x }
      wasRun = true
      return x.changeBody('X')
    })
    await testCompression(gzipSync, 'gzip', 'X')
  })
})
