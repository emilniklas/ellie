import { renderToString } from 'react-dom/server'

export default function ServerView (props) {
  const Component = props.component
  const propNames = Object.keys(props)
    .filter((name) => name !== 'component')
  const componentProps = Object.assign(
    {},
    ...propNames.map((name) => ({ [name]: props[name] }))
  )
  return (
    <div
      data-view={Component.id}
      data-props={JSON.stringify(componentProps)}
      dangerouslySetInnerHTML={{
        __html: renderToString(
          <Component {...componentProps} />
        )
      }}
    />
  )
}
