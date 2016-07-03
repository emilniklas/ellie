import { env } from 'eliot'

export default function ClientView (...components) {
  return {
    mount () {
      components.forEach(mountComponent)
    }
  }
}

if (env.ELIOT_BROWSER) {
  ClientView._render = require('react-dom').render
}

function mountComponent (Component) {
  const id = Component.id
  const nodes = Array.prototype.slice.call(
    document.querySelectorAll(`[data-view=${id}]`)
  )

  nodes.forEach((node) => {
    const props = JSON.parse(node.getAttribute('data-props'))
    ClientView._render(<Component {...props} />, node)
  })
}
