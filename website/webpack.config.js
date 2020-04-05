const path = require('path')

console.log(path.resolve(__dirname, '/dist'))

module.exports = {
  entry: './website/src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/')
  }
}
