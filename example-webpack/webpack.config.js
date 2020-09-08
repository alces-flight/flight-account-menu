const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'flight-account-menu.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    // libraryExport: 'default',
    library: 'flightAccountMenu'
  },
  externals: {
    'react': {
      commonjs: 'React',
      commonjs2: 'React',
      amd: 'React',
      root: '_'
    },
    'react-dom': {
      commonjs: 'ReactDOM',
      commonjs2: 'ReactDOM',
      amd: 'ReactDOM',
      root: '_'
    },
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      }
    ]
  },
}
