import { loader } from 'mini-css-extract-plugin';

// https://webpack.js.org/guides/environment-variables/
const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },
  devtool: false,
  module: {
    rules: [
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

export default prodConfig;
