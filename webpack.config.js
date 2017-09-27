const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    ko: './js/src/entryPoints/ko.js'
  },
  plugins: [
     new webpack.optimize.CommonsChunkPlugin({
       name: 'common' // Specify the common bundle's name.
     })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'js/dist')
  },
  resolve: {
    modules: ['js/lib', 'node_modules']
  }
};