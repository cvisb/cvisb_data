const path = require('path');
const webpack = require('webpack');

module.exports = {
  devServer: {
    // this achieves the same effect as the first example
    // with the bonus of not having to update your config
    // if new subdomains need to access the dev server
    // allowedHosts: [
      // '.cvisb.org'
    // ],
    compress: true,
    public: 'cvisb.org'
  },
  entry: {
    server: './server.ts'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  target: 'node',
  mode: 'none',
  // this makes sure we include node_modules and other 3rd party libraries
  externals: [/node_modules/],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader'
    }]
  },
  plugins: [
    // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
    // for 'WARNING Critical dependency: the request of a dependency is an expression'
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'), {}
    )
  ]
};
