var path = require('path');

var entryFile = path.resolve(__dirname, '..', 'client', 'scripts', 'main.js');
var outFolder = path.resolve(__dirname, '..', 'client', 'dist');

module.exports = {
  devtool: 'eval',
  entry: [
    entryFile],
  output: {
    path: outFolder,
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  }
}
