/**
 * Parses a query string
 */
export default class QueryStringParser {
  constructor () {
    this._queryKeyValue = this._queryKeyValue.bind(this)
  }

  parse (query) {
    return query.split('&')
      .reduce(this._queryKeyValue, {})
  }

  _queryKeyValue (body, query) {
    const [ encKey, encValue ] = query.split('=')
    const key = decodeURIComponent(encKey)
    const value = decodeURIComponent(encValue)
    const arrayConsPattern = /\[\]$/

    if (arrayConsPattern.test(key)) {
      const actualKey = key.replace(arrayConsPattern, '')
      const array = body[actualKey] || []
      return Object.assign(body, {
        [actualKey]: array.concat(value)
      })
    }

    return Object.assign(body, { [key]: value })
  }
}
