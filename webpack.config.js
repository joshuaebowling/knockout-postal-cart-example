const path = require('path');

module.exports = {
  entry: {
    ko: './js/src/entryPoints/ko.js'
  },
//   plugins: [
//     new HTMLWebpackPlugin({
//       title: 'Code Splitting'
//     })
//   ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'js/dist')
  },
  resolve: {
    modules: ['js/lib', 'node_modules']
  },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /(node_modules|bower_components)/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['env']
//           }
//         }
//       }
//     ]
//   }
};