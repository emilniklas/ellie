import Server from './Server'
import { createServer } from 'http'

export default function serve (pipeline) {
  return new Server(pipeline, createServer)
}
