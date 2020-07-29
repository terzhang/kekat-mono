const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { DIST } = require('./common-paths.ts');

module.exports = {
  mode: 'development',
  output: {
    filename: '[name].[hash].js',
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // style-loader only in development
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  devServer: {
    contentBase: DIST,
    compress: true,
    port: 8888,
    historyApiFallback: true,
    writeToDisk: true,
    hot: true,
  },
};
