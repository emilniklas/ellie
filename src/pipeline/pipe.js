import Pipeline from './Pipeline'

export default function pipe (...middleware) {
  const pipeline = Pipeline.make(middleware)
  return pipeline
}
