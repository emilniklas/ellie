import Pipeline from './Pipeline'

export default function pipe (...middleware) {
  const pipeline = new Pipeline(middleware)
  return pipeline
}
