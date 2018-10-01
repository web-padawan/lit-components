const path = require('path');
const { rules } = require('../../utils/webpack.common.js');

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../../tmp'),
    filename: 'tests.js'
  },
  module: {
    rules: [
      ...rules,
      {
        test: /\.(jpg|gif|png)$/,
        loader: 'url-loader'
      }
    ]
  }
};
