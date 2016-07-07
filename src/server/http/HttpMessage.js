import Headers from './Headers'

export default class HttpMessage {
  constructor (headers) {
    this.headers = headers || new Headers()
    this._store = {}
  }

  get _protected () {
    return ['headers']
  }

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
}
