export default class NoResponseError extends Error {
  constructor () {
    super('The pipeline did not yield a response')
  }
}
