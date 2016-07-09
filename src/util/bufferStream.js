/**
 * A handy function that turns a readable stream into a
 * promise of the completed payload.
 */
export default function bufferStream (stream) {
  return new Promise((resolve, reject) => {
    let chunks = []

    stream.on('data', (buffer) => {
      const chunk = buffer.toString()
      chunks.push(chunk)
    })

    stream.on('error', (error) => {
      stream.destroy()
      reject(error)
    })

    stream.on('end', () => {
      resolve(chunks.join(''))
    })
  })
}
