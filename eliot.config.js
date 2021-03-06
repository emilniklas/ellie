import { Target } from 'eliot/config'

export default {
  library: 'Ellie',
  jsx: true,

  targets: [{
    target: Target.NODE6,
    entry: 'src/server/index.js',
    output: 'build/server.js'
  }, {
    target: Target.ES5,
    entry: 'src/client/index.js',
    output: 'build/client.js'
  }]
}
