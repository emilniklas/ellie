import { describe, it } from '../../header'
import Server from 'ellie/src/server/http/Server'
import Response from 'ellie/src/server/http/Response'

describe('Server', () => {
  const setUpServer = (pipeline) => {
    const mockListener = {
      listen (port, hostname, callback) {
        this.port = port
        this.hostname = hostname
        callback()
      }
    }
    const mockListenerFactory = (handler) => {
      mockListener.handler = handler
      return mockListener
    }
    const server = new Server(pipeline, mockListenerFactory)

    return [ server, mockListener ]
  }

  it('works', async function () {
    const mockPipeline = {
      pipe (request) {
        this.request = request
        this.response = Response.ok('Response')

        return Promise.resolve(this.response)
      }
    }
    const [ server, mockListener ] = setUpServer(mockPipeline)
    await server.listen(8080)

    mockListener.port.should.equal(8080)
    mockListener.hostname.should.equal('0.0.0.0')

    const response = await server.request('GET', '/')
    await response.body.buffer().should.eventually.equal('Response')
  })

  it('can be decorated with response decorators', async function () {
    const mockPipeline = {
      decorate (...decorators) {
        return { decorators }
      }
    }

    const [ server ] = setUpServer(mockPipeline)

    server.decorate(1, 2, 3)._pipeline.decorators.should.deep.equal([1, 2, 3])
  })
})
