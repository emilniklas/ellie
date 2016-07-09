import parse from 'co-body'

export default class JSONRequestBodyParser {
  parse (stream) {
    if (!stream.headers) {
      stream.headers = {
        'content-length': null
      }
    }
    return parse.json(stream)
  }
}
