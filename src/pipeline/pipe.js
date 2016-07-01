import Pipeline from './Pipeline'

export default function pipe (...middleware) {
  return new Pipeline(middleware)
}
