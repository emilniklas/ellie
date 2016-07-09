import native from 'fs'

function promisify (func) {
  return (...args) => new Promise((resolve, reject) => {
    func(...args, (err, response) => {
      if (err) {
        return reject(err)
      }
      resolve(response)
    })
  })
}

export const rename = promisify(native.rename)
