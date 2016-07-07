import GetRequestBodyParser from './GetRequestBodyParser'

export default class RequestBodyParser {
  constructor () {
    this._get = new GetRequestBodyParser()
  }

  parse (request) {
    switch (request.method) {
      case 'GET':
        return this._get.parse(request)
      default:
        return {}
    }
  }
}
