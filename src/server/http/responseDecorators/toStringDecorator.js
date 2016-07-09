import Response from '../Response'
import { Readable } from 'stream'

/**
 * This decorator should be declared first, ensuring
 * that everything is cast to a Response somehow.
 */
export default function toStringDecorator (response) {
  if (response instanceof Response) {
    return response
  }

  if (response instanceof Readable) {
    return Response.ok(response)
  }

  if (typeof response === 'object') {
    return Response.json(response)
  }

  // If all else fails, simply cast to string.
  return Response.ok(String(response))
}
