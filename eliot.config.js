import { Target } from 'eliot/config'

export default {
  library: true,
  jsx: true,

  targets: [{
    target: Target.NODE6,
    entry: 'src/server/index.js',
    output: 'build/server.js'
  }, {
    target: Target.NODE6,
    entry: 'src/client/index.js',
    output: 'build/client.js'
  }]
}
