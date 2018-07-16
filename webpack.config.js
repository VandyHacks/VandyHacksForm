const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PORT = process.env.PORT || 5000;

module.exports = {
  entry: {
    bundle: './src/client.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader'],
          },
        ),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin(
      { filename: 'style.css' },
    ),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/form.html',
      filename: 'form.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/submitted.html',
      filename: 'submitted.html',
    }),
  ],
  devServer: {
    // Display only errors to reduce the amount of output.
    stats: 'errors-only',

    // Parse host and port from env to allow customization.
    //
    // If you use Docker, Vagrant or Cloud9, set
    // host: options.host || "0.0.0.0";
    //
    // 0.0.0.0 is available to all network devices
    // unlike default `localhost`.
    host: process.env.HOST, // Defaults to `localhost`
    port: PORT, // Defaults to 8080
    open: true, // Open the page in browser
  },
};
