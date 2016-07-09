/**
 * Represents HTTP headers.
 */
export default class Headers {
  constructor (raw = []) {
    this._raw = raw

    this._formatName = this._formatName.bind(this)
  }

  /**
   * Sets a header. The same header can have multiple values,
   * in which case they will be concatinated with a comma,
   * as described in the HTTP 1.1 specification.
   *
   * If you want to replace a header, you must clear it first.
   *
   *     headers
   *       .clear('Origin')
   *       .set('Origin', 'totally-real.net')
   *
   * @param {String} name
   * @param value - Can be anything, but at the end, the #toString
   *                method of this object dictates the actual header value.
   * @returns {Headers}
   */
  set (name, value) {
    return new Headers(
      this._raw.concat([[name.toLowerCase(), value]])
    )
  }

  /**
   * Gets a header, or an empty string.
   *
   * @param {String} name
   * @returns {String}
   */
  get (name) {
    const headerName = name.toLowerCase()
    return this._raw
      .filter(([name]) => name === headerName)
      .map(([, value]) => value)
      .filter((value, pos, l) => l.indexOf(value) === pos)
      .join(', ')
  }

  /**
   * Clears a header.
   */
  clear (name) {
    const headerName = name.toLowerCase()
    return new Headers(
      this._raw.filter(([name]) => name !== headerName)
    )
  }

  /**
   * Runs a function for every header.
   *
   * @param {(String, String) -> Void}
   */
  forEach (callback) {
    this.map(callback)
  }

  /**
   * Runs a function for every header,
   * returning an array containing the
   * result of applying the function to every header.
   *
   * @param {(String, String) -> T}
   * @returns {[T]}
   */
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
      .replace(/-\w/g, upperCase)
      .replace(/^\w/g, upperCase)
  }

  toString () {
    return this
      .map((name, value) => `${name}: ${value}`)
      .join('\n')
  }

  inspect () {
    return 'Headers {\n  ' + this.toString().replace(/\n/g, '\n  ') + '\n}'
  }
}
