import { parse } from 'url'

export default class GetRequestBodyParser {
  constructor () {
    this._queryKeyValue = this._queryKeyValue.bind(this)
  }

  queryString (query) {
    return Object.assign(
      {},
      ...query.split('&').map(this._queryKeyValue)
    )
  }

  _queryKeyValue (query) {
    const [ encKey, encValue ] = query.split('=')
    const key = decodeURIComponent(encKey)
    const value = decodeURIComponent(encValue)
    return { [key]: value }
  }

  parse (request) {
    const parsed = parse(request.url)

    if (!parsed.query) { return {} }

    return this.queryString(parsed.query)
  }
}
