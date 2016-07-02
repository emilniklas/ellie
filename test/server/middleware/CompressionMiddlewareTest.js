import { describe, it } from '../../header'
import CompressionMiddleware from 'ellie/src/server/middleware/CompressionMiddleware'
import { Response, Request, Headers } from 'ellie/src/server'
import { gzipSync, deflateSync } from 'zlib'

describe('CompressionMiddleware', () => {
  const middleware = CompressionMiddleware(() => Promise.resolve(Response.ok('x')))

  it("does nothing to a request that doesn't accept the gzip encoding", async function () {
    const response = await middleware(new Request('GET', '/'))
    await response.body.buffer().should.eventually.equal('x')
  })

  async function testCompression (encoder, encoding) {
    const headers = new Headers()
      .set('Accept-Encoding', encoding)
    const request = new Request('GET', '/', headers)
    const response = await middleware(request)
    await response.body.buffer().should.eventually.equal(encoder('x').toString())
    response.header('Transfer-Encoding').should.equal(encoding)
  }

  it('gzip encodes the response body', async function () {
    await testCompression(gzipSync, 'gzip')
  })

  it('deflate encodes the response body', async function () {
    await testCompression(deflateSync, 'deflate')
  })
})
