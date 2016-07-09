import { Form } from 'multiparty'
import UploadedFile from '../UploadedFile'

export default class FormDataRequestBodyParser {
  constructor () {
    this._reduceFields = this._reduceFields.bind(this)
  }

  parse (stream) {
    const form = new Form()
    return new Promise((resolve, reject) => {
      form.parse(stream, (err, fields, files) => {
        if (err) {
          return reject(err)
        }
        resolve(this._createBody(fields, files))
      })
    })
  }

  _keyArrayToTuples (array, tuples, key) {
    const values = array[key]
    return tuples.concat(
      values.map((value) => [key, value])
    )
  }

  _createBody (fields, files) {
    const fieldTuples = Object.keys(fields)
      .reduce(this._keyArrayToTuples.bind(this, fields), [])
    const fileTuples = Object.keys(files)
      .reduce(this._keyArrayToTuples.bind(this, files), [])
      .map(([k, v]) => [k, this._file(v)])

    return fieldTuples
      .concat(fileTuples)
      .reduce(this._reduceFields, {})
  }

  _reduceFields (fields, [name, value]) {
    const arrayMarker = /\[\]$/
    if (arrayMarker.test(name)) {
      const key = name.replace(arrayMarker, '')
      const arr = fields[key] || []
      return Object.assign({}, fields, {
        [key]: arr.concat(value)
      })
    }
    return Object.assign({}, fields, {
      [name]: value
    })
  }

  _file (fileData) {
    return new UploadedFile({
      filename: fileData.originalFilename,
      temp: fileData.path,
      size: fileData.size,
      type: fileData.headers['content-type']
    })
  }
}
