import { describe, it } from '../../header'
import ResponseBody from 'ellie/src/server/http/ResponseBody'
import { createReadStream } from 'fs'
import { resolve } from 'path'

const fixture = resolve(__dirname, 'fixtures', 'response.txt')

describe('ResponseBody', () => {
  it("implements Node's Readable Stream", (done) => {
    const response = new ResponseBody('x')
    let output = ''
    response.on('data', (chunk) => {
      output += chunk.toString()
    })
    response.on('end', () => {
      output.should.equal('x')
      done()
    })
  })

  it('can create a Promise of a Buffer from itself', async function () {
    const response = await new ResponseBody('x').buffer()
    response.toString().should.equal('x')
  })

  it('can be created from another stream', async function () {
    const stream = createReadStream(fixture)
    const response = await new ResponseBody(stream).buffer()
    response.toString().should.equal('This is a response\n')
  })
})
