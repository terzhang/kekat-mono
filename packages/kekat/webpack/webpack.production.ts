import { loader } from 'mini-css-extract-plugin';
import commonLoaders from './common-loaders';

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
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          // extract the CSS from bundle to use parallel loading of CSS/JS resources later on
          loader,
          ...commonLoaders,
        ],
      },
    ],
  },
};

export default prodConfig;
