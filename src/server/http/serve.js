import Server from './Server'
import { createServer } from 'http'
import decorators from './responseDecorators'

export default function serve (pipeline) {
  return new Server(pipeline, createServer)
    .decorate(...decorators)
}
