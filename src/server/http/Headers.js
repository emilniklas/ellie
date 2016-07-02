export default class Headers {
  constructor (raw = []) {
    this._raw = raw

    this._formatName = this._formatName.bind(this)
  }

  set (name, value) {
    return new Headers(
      this._raw.concat([[name.toLowerCase(), value]])
    )
  }

  get (name) {
    const headerName = name.toLowerCase()
    return this._raw
      .filter(([name]) => name === headerName)
      .map(([, value]) => value)
      .filter((value, pos, l) => l.indexOf(value) === pos)
      .join(', ')
  }

  forEach (callback) {
    this.map(callback)
  }

  map (transform) {
    return this._raw
      .map(([name]) => name)
      .filter((name, pos, l) => l.indexOf(name) === pos)
      .map(this._formatName)
      .map((name) => transform(name, this.get(name)))
  }

  _formatName (name) {
    const upperCase = (s) => s.toUpperCase()
    return name
      .replace(/-\w/, upperCase)
      .replace(/^\w/, upperCase)
  }

  toString () {
    return this
      .map((name, value) => `${name}: ${value}`)
      .join('\n')
  }

  inspect () {
    return 'Headers {\n  ' + this.toString().replace(/\n/, '\n  ') + '\n}'
  }
}
