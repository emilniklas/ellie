import GetRequestBodyParser from './GetRequestBodyParser'
import JSONRequestBodyParser from './JSONRequestBodyParser'
import UrlencodedRequestBodyParser from './UrlencodedRequestBodyParser'
import FormDataRequestBodyParser from './FormDataRequestBodyParser'
import { Readable } from 'stream'

export default class RequestBodyParser {
  constructor () {
    this._get = new GetRequestBodyParser()
    this._json = new JSONRequestBodyParser()
    this._urlencoded = new UrlencodedRequestBodyParser()
    this._formData = new FormDataRequestBodyParser()
  }

  async parse (request, nativeRequest) {
    if (request.method === 'GET') {
      return this._get.parse(request)
    }
    if (request.headers.get('Content-Type').indexOf('application/json') !== -1) {
      return this._json.parse(nativeRequest)
    }
    if (request.headers.get('Content-Type').indexOf('application/x-www-form-urlencoded') !== -1) {
      return this._urlencoded.parse(nativeRequest)
    }
    if (request.headers.get('Content-Type').indexOf('multipart/form-data') !== -1) {
      return this._formData.parse(nativeRequest)
    }
    const body = new Readable()
    body._read = nativeRequest._read.bind(nativeRequest)
    body.on = nativeRequest.on.bind(nativeRequest)
    return body
  }
}
