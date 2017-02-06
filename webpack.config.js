var webpack = require('webpack');
var path = require('path');

var outFolder = path.resolve(__dirname, 'dist');

module.exports = {
  devtool: 'eval',
  entry: {
    desktop: './desktop/scripts/main.js',
    mobile: './mobile/scripts/main.js'
  },
  output: {
    path: outFolder,
    filename: '[name]/bundle.min.js'
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
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader?name=assets/[name].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}
