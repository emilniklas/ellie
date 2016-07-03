import { describe, it } from '../../header'
import ClientView from 'ellie/src/view/client/ClientView'
import { renderToStaticMarkup } from 'react-dom/server'

let querySelectorAllReturnValue = null
global.document = {
  querySelectorAll (selector) {
    return querySelectorAllReturnValue
  }
}

let renderWasCalledWith = []
ClientView._render = (element, node) => {
  renderWasCalledWith.push([ element, node ])
}

const Component = ({ prop }) => <div>Hello {prop}</div>
Component.id = 'Component'

describe('ClientView', () => {
  it('attempts to mount components to its server rendered equivalent', () => {
    const nodeA = {
      getAttribute (name) {
        name.should.equal('data-props')
        return '{"prop":"valueA"}'
      }
    }
    const nodeB = {
      getAttribute (name) {
        name.should.equal('data-props')
        return '{"prop":"valueB"}'
      }
    }
    querySelectorAllReturnValue = [nodeA, nodeB]

    ClientView(Component).mount()

    const [ renderElementA, renderNodeA ] = renderWasCalledWith[0]
    const [ renderElementB, renderNodeB ] = renderWasCalledWith[1]

    renderNodeA.should.equal(nodeA)
    renderNodeB.should.equal(nodeB)

    renderToStaticMarkup(renderElementA).should.equal(
      renderToStaticMarkup(<Component prop='valueA' />)
    )
    renderToStaticMarkup(renderElementB).should.equal(
      renderToStaticMarkup(<Component prop='valueB' />)
    )
  })
})
