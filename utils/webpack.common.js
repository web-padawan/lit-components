module.exports = {
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules\/(?!(@webcomponents\/shadycss|lit-css|styled-lit-element|lit-html|@polymer|@vaadin|@lit)\/).*/,
      options: {
        cacheDirectory: true
      }
    }
  ]
};
