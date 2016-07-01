export default class Headers {
  constructor (raw = []) {
    this._raw = raw
  }

  forEach (callback) {
    this._raw.forEach(([name, value]) => callback(name, value))
  }

  map (transform) {
    return new Headers(this._raw.map(
      ([name, value]) => [name, transform(name, value)]
    ))
  }

  toString () {
    return this._raw
      .map(([name, value]) => `${name}: ${value}`)
      .join('\n')
  }

  inspect () {
    return 'Headers {\n  ' + this.toString().replace(/\n/, '\n  ') + '\n}'
  }
}
