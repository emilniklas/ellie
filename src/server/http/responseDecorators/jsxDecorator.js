import { isValidElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Response from '../Response'

/**
 * If a middleware returns JSX (a React element) this
 * decorator turns it into an HTML response.
 */
export default function jsxDecorator (response) {
  if (isValidElement(response)) {
    return Response.ok(render(response))
  }
  return response
}

function render (element) {
  return '<!DOCTYPE html>' + renderToStaticMarkup(enforceTrunk(element))
}

/**
 * Whatever the root element's tag name is, this
 * function normalizes it and makes sure there is
 * always a proper <html> element and <body> in place.
 */
function enforceTrunk (element) {
  switch (element.type) {
    case 'html':
      return element
    case 'head':
      return (
        <html>
          {element}
          <body />
        </html>
      )
    case 'body':
      return (
        <html>
          <head />
          {element}
        </html>
      )
    default:
      return (
        <html>
          <head />
          <body>{element}</body>
        </html>
      )
  }
}
