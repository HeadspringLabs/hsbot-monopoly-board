const webpack = require('webpack');

module.exports = {
  entry: './src/client.js',
  output: {
    path: './public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.GET_HOST': JSON.stringify(process.env.API_HOST)
    })
  ]
};
