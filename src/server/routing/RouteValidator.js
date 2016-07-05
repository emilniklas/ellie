function zip (a, b) {
  const length = Math.max(a.length, b.length)
  let acc = []
  for (let i = 0; i < length; i++) {
    acc.push([a[i], b[i]])
  }
  return acc
}

export default class RouteValidator {
  constructor (method, pattern) {
    this.method = method
    this.pattern = this._removeTrailingOrLeadingSlashes(pattern)
  }

  validate (method, url) {
    return this._methodIsOK(method) && this._urlIsOK(url)
  }

  params (url) {
    const zip = this._zip(url)
    if (!zip) { return {} }
    const optionalMarker = /\?$/
    return zip.reduce((params, [ pattern, url ]) => {
      const isOptional = optionalMarker.test(pattern)
      const isParam = pattern.indexOf(':') === 0
      const nonOptional = (p) => p.replace(optionalMarker, '')

      if (!isParam && !isOptional) {
        return params
      }

      const param = isOptional && !isParam
        ? nonOptional(pattern)
        : nonOptional(pattern.substr(1))

      return Object.assign({}, params, { [param]: isParam ? url : !!url })
    }, {})
  }

  path (url) {
    const zip = this._zip(url)
    if (!zip) { return '' }
    return zip
      .filter(([ pattern ]) => {
        return pattern === void 0 || pattern === '...'
      })
      .map(([, url]) => url)
      .join('/')
  }

  _methodIsOK (method) {
    return this.method.test(method)
  }

  _zip (url) {
    const urlParts = this._removeTrailingOrLeadingSlashes(url).split('/')
    const patternParts = this.pattern.split('/')
    const isRest = patternParts[patternParts.length - 1] === '...'
    const patternPartsWithoutOptionals = patternParts
      .filter((p) => !(/\?$/.test(p)))

    const sizeComparison = isRest
      ? (u, p) => u.length >= p.length - 1
      : (u, p) => u.length === p.length

    if (!sizeComparison(urlParts, patternParts) &&
       !sizeComparison(urlParts, patternPartsWithoutOptionals)) {
      return null
    }

    return zip(patternParts, urlParts)
  }

  _urlIsOK (url) {
    const zip = this._zip(url)
    if (!zip) { return false }
    return zip.reduceRight((acc, [ pattern, url ]) => {
      if (pattern === '...') {
        return true
      }
      return acc && this._compare(pattern, url)
    }, true)
  }

  _compare (pattern, url) {
    const optionalMarker = /\?$/
    if (pattern[0] === ':') {
      return true
    }
    if (optionalMarker.test(pattern)) {
      return pattern.replace(/\?$/, '') === url || url === void 0
    }
    return pattern === url
  }

  _removeTrailingOrLeadingSlashes (url) {
    return url
      .replace(/^\/+/, '')
      .replace(/\/+$/, '')
  }
}
