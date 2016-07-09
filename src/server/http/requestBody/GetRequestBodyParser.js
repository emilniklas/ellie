import { parse } from 'url'
import QueryStringParser from './QueryStringParser'

export default class GetRequestBodyParser {
  constructor () {
    this._queryString = new QueryStringParser()
  }

  async parse (request) {
    const parsed = parse(request.url)

    if (!parsed.query) { return {} }

    return this._queryString.parse(parsed.query)
  }
}
