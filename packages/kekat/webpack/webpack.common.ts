const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { ROOT, SRC, PATH } = require('./common-paths.ts');

// see here on how to split config between dev and prod builds
// https://webpack.js.org/guides/environment-variables/
module.exports = {
  context: ROOT, // to automatically find tsconfig.json
  entry: {
    app: SRC + '/index.tsx',
  },
  output: {
    path: PATH,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\/fonts\/.*\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=fonts/[hash].[ext]',
      },
      {
        test: [/\/images\/.*\.svg$/, /@coreui\/icons/],
        loader: 'svg-react-loader',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [
    // prevent file hashes changing unexpectedly
    new webpack.HashedModuleIdsPlugin({
      context: __dirname,
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Kekat Chat',
      template: SRC + '/index.html',
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],

  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true,
          },
        },
      }),
      new TerserPlugin({
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
        extractComments: false,
      }),
    ],
    // as explained and demonstrated here:
    // https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
    runtimeChunk: 'single',
    splitChunks: {
      name: false,
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: (module) => {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
        styles: {
          test: /\.css$/,
          enforce: true,
        },
      },
    },
  },
};
