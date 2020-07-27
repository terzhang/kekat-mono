const { loader } = require('mini-css-extract-plugin');

// https://webpack.js.org/guides/environment-variables/
module.exports = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          // babel-loader option references babel config file
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
              allowTsInNodeModules: true,
              compilerOptions: {
                sourceMap: true,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          // style-loader only in development
          loader,
          'css-loader',
        ],
      },
    ],
  },
};
