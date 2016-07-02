export default class ContentType {
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

ContentType.JSON = new ContentType('application', 'json', 'utf-8')
ContentType.TEXT = new ContentType('text', 'plain', 'utf-8')
ContentType.HTML = new ContentType('text', 'html', 'utf-8')
