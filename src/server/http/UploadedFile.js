import { rename } from '../../util/fileSystem'
import path from 'path'

/**
 * This class will be created by the FormDataRequestBodyParser
 * if there is an uploaded file in the body.
 *
 * It simplifies the workflow of saving an uploaded file
 * to disk.
 *
 *     function (request) {
 *       return request.body.myFile.save('my_file.txt')
 *     }
 *
 *     <form>
 *       <input type='file' name='myFile' />
 *     </form>
 */
export default class UploadedFile {
  constructor ({ filename, temp, size, type }) {
    this.filename = filename
    this.temp = temp
    this.size = size
    this.type = type
  }

  /**
   * Saves the uploaded file.
   *
   * @param file - The filename to save to.
   */
  async save (file) {
    const targetPath = path.resolve(file)
    return rename(this.temp, targetPath)
  }

  /**
   * Saves the uploaded file with its original name.
   *
   * @param directory - The directory to save to.
   */
  async saveWithOriginalName (directory) {
    return this.save(path.resolve(directory, this.filename))
  }
}
