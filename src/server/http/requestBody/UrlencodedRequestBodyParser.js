import QueryStringParser from './QueryStringParser'
import bufferStream from '../../../util/bufferStream'

/**
 * Parses the body of a request with the
 * content type application/x-www-form-urlencoded
 */
export default class UrlencodedRequestBodyParser {
  constructor () {
    this._queryString = new QueryStringParser()
  }

  async parse (stream) {
    return this._queryString.parse(await bufferStream(stream))
  }
}
