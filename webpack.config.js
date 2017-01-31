var webpack = require('webpack');
var path = require('path');

var outFolder = path.resolve(__dirname, 'dist');

module.exports = {
  devtool: 'eval',
  entry: {
    client: './client' + '/scripts' + '/main.js',
    mobile: './mobile' + '/scripts' + '/main.js'
  },
  output: {
    path: outFolder,
    filename: '[name].min.js'
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
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}
