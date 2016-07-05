import { describe, it } from '../../header'
import Route from 'ellie/src/server/routing/Route'
import serve from 'ellie/src/server/http/serve'

describe('Route', () => {
  async function assertRoute (route, [method, url], expected) {
    const server = serve(route)
    const response = await server.request(method, url)

    await response.body.buffer().should.eventually.equal(expected)
  }

  async function assertNoResponse (route, [method, url]) {
    const server = serve(route)
    const response = server.request(method, url)

    await response.should.be.rejected
  }

  describe('.make', () => {
    it('routes requests to another pipeline if matches method and url', async function () {
      const route = Route.make(/GET/, '/', () => () => 'response')
      await assertRoute(route, ['GET', '/'], 'response')
      await assertNoResponse(route, ['GET', '/x'])
    })
  })

  describe('.get', () => {
    it('routes GET requests', async function () {
      const route = Route.get('/', () => () => 'response')
      await assertRoute(route, ['GET', '/'], 'response')
      await assertNoResponse(route, ['POST', '/'])
    })

    it('routes HEAD requests', async function () {
      await assertRoute(
        Route.get('/', () => () => 'response'),
        ['HEAD', '/'],
        'response'
      )
    })

    it('sets route params on the request', async function () {
      await assertRoute(
        Route.get(':x', () => ({ params }) => params),
        ['HEAD', '/a'],
        '{"x":"a"}'
      )
    })
  })

  it('handles nested routes', async function () {
    const route = Route.all('root/...',
      Route.get('/', () => () => 'trunk'),
      Route.post('branch', () => () => 'branch'),
      Route.get('branch2', () => () => 'branch2')
    )
    await assertRoute(route, ['GET', 'root'], 'trunk')
    await assertRoute(route, ['POST', 'root/branch'], 'branch')
    await assertNoResponse(route, ['GET', 'root/branch'], 'branch')
    await assertRoute(route, ['GET', 'root/branch2'], 'branch2')
    await assertNoResponse(route, ['GET', 'root/branch3'])
  })
})
