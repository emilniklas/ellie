import { describe, it } from '../../header'
import ServerView from 'ellie/src/view/server/ServerView'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'

const Component = ({ prop }) => <div>Hello {prop}</div>
Component.id = 'Component'

describe('ServerView', () => {
  it('renders React markup', () => {
    const expected = renderToStaticMarkup(
      <div data-view='Component' data-props='{"prop":"value"}' dangerouslySetInnerHTML={{
        __html: renderToString(
          <Component prop='value' />
        )
      }} />
    )

    const actual = renderToStaticMarkup(
      <ServerView component={Component} prop='value' />
    )

    actual.should.equal(expected)
  })
})
