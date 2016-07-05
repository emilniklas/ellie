import Server from './Server'
import { createServer } from 'http'
import decorators from './responseDecorators'
import pipe from '../../pipeline/pipe'

export default function serve (...middleware) {
  const pipeline = pipe(...middleware)
  return new Server(pipeline, createServer)
    .decorate(...decorators)
}
