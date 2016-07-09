/**
 * A middleware must always return a response. This decorator
 * stops an undefined value from propagating through the pipeline.
 */
export default function noUndefinedDecorator (response, name) {
  if (response === void 0) {
    throw new TypeError(`${name} must return a response or throw an error`)
  }
  return response
}
