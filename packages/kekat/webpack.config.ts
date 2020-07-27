const { merge } = require('webpack-merge');
const commonConfig = require('./webpack/webpack.common.ts');

// environment defaults to development
const env = process.env.NODE_ENV || 'development';

// use NODE_ENV to decided which environment config to merge with common config
const envConfig = require(`./webpack/webpack.${env}.ts`);
const bundleAnalyzer = require(`./webpack/addons/bundleAnalyzer.ts`);

module.exports = () => {
  const isAnalyze =
    process.env.ANALYZE === 'true' || process.env.analyze === 'true';

  const merged = merge(
    commonConfig,
    envConfig,
    isAnalyze ? bundleAnalyzer : {}
  );
  return merged;
};
