/**
 * Represents the Content-Type header.
 */
export default class ContentType {
  /**
   * The type, subtype, and charset of the content type,
   * expressed in the HTTP header as follows:
   *
   *     [type]/[subtype]; charset=[charset]
   */
  constructor (type, subtype, charset) {
    this.type = type
    this.subtype = subtype
    this.charset = charset
  }

  toString () {
    const charset = this.charset == null
      ? ''
      : `; charset=${this.charset}`

    return `${this.type}/${this.subtype}${charset}`
  }
}

// Some predefined content types
ContentType.JSON = new ContentType('application', 'json', 'utf-8')
ContentType.TEXT = new ContentType('text', 'plain', 'utf-8')
ContentType.HTML = new ContentType('text', 'html', 'utf-8')
