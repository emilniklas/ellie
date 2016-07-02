import { isValidElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Response from '../Response'

export default function jsxDecorator (response) {
  if (isValidElement(response)) {
    return Response.ok(render(response))
  }
  return response
}

function render (element) {
  return '<!DOCTYPE html>' + renderToStaticMarkup(enforceTrunk(element))
}

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
