import Response from '../Response'

export default function toStringDecorator (response) {
  if (response instanceof Response) {
    return response
  }
  if (typeof response === 'object') {
    return Response.json(response)
  }
  return Response.ok(String(response))
}
