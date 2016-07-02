export default function noUndefinedDecorator (response, name) {
  if (response === void 0) {
    throw new TypeError(`${name} must return a response or throw an error`)
  }
  return response
}
