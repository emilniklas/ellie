import Server from './Server'
import { createServer } from 'http'
import decorators from './responseDecorators'
import pipe from '../../pipeline/pipe'

/**
 * A helper for creating a server with the basic
 * response decorators.
 *
 * @param ...middleware - The middleware to be included in
 *                        the HTTP pipeline.
 * @returns Server
 */
export default function serve (...middleware) {
  const pipeline = pipe(...middleware)

  return new Server(pipeline, createServer)
    .decorate(...decorators)
}
