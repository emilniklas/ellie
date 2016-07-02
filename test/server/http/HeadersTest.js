import { describe, it } from '../../header'
import Headers from 'ellie/src/server/http/Headers'

describe('Headers', () => {
  describe('#set', () => {
    it('sets a header', () => {
      new Headers()
        .set('content-type', 'text/plain')
        ._raw.should.deep.equal([
          ['content-type', 'text/plain']
        ])
    })

    it('is case insensitive', () => {
      new Headers()
        .set('Content-Type', 'text/plain')
        ._raw.should.deep.equal([
          ['content-type', 'text/plain']
        ])
    })
  })

  describe('#get', () => {
    it('gets a header', () => {
      new Headers()
        .set('Content-Type', 'text/plain')
        .get('Content-Type').should.equal('text/plain')
    })

    it('is case insensitive', () => {
      new Headers()
        .set('Content-Type', 'text/plain')
        .get('contenT-Type').should.equal('text/plain')
    })

    it('returns a comma separated list if multiple of the same header has been set', () => {
      new Headers()
        .set('header', 'a')
        .set('Header', 'b')
        .get('HEADER').should.equal('a, b')
    })

    it('does not return duplicates', () => {
      new Headers()
        .set('header', 'a')
        .set('header', 'b')
        .set('header', 'a')
        .get('header').should.equal('a, b')
    })

    it('allows for passing objects as values', () => {
      const headers = new Headers()
        .set('header', {})
        .set('header2', { toString: () => 'value' })

      headers.get('header').should.equal('[object Object]')
      headers.get('header2').should.equal('value')
    })
  })

  describe('#forEach', () => {
    it('runs a function for every header', () => {
      let output = []

      new Headers()
        .set('A', 'v')
        .set('B', 'v')
        .set('C', 'v')
        .set('C', 'v')
        .set('B', 'w')
        .forEach((name, value) => output.push([name, value]))

      output.should.deep.equal([
        ['A', 'v'],
        ['B', 'v, w'],
        ['C', 'v']
      ])
    })
  })

  describe('#toString', () => {
    it('summarizes, normalizes name casing and outputs a formatted headers list', () => {
      new Headers()
        .set('header-name', 'value1')
        .set('Header-Name', 'value2')
        .set('header-Name', 'value2')
        .set('other-header', 'value1')
        .set('other-Header', 'value1')
        .set('ThirdHeader', 'value1')
        .toString().should.equal([
          'Header-Name: value1, value2',
          'Other-Header: value1',
          'Thirdheader: value1'
        ].join('\n'))
    })
  })
})
