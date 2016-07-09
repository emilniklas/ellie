import Headers from './Headers'

/**
 * Common functionality for requests and responses.
 * Contains the headers as well as an immutable
 * key/value store.
 */
export default class HttpMessage {
  constructor (headers) {
    this.headers = headers || new Headers()
    this._store = {}
  }

  /**
   * Sets a value.
   *
   * @param {String} key
   * @param value
   * @returns {HttpMessage} - Of same type as this
   */
  set (key, value) {
    if (this._protected.includes(key)) {
      throw new Error(`Cannot set protected property ${key}`)
    }
    const copy = this._copy()
    Object.assign(copy, this._store)
    Object.assign(copy._store, this._store)
    copy._store[key] = value
    copy[key] = value
    return copy
  }

  /**
   * Unsets a value.
   *
   * @param {String} key
   * @returns {HttpMessage} - Of same type as this
   */
  unset (key) {
    const copy = this._copy()
    Object.assign(copy, this._store)
    delete copy._store[key]
    delete copy[key]
    return copy
  }

  _copy () {
    throw new Error('Implement this method')
  }

  get _protected () {
    return ['headers']
  }
}
