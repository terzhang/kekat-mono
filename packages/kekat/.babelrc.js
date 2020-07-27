// setup according to https://github.com/pmmmwh/react-refresh-webpack-plugin
// babel config doc: https://babeljs.io/docs/en/configuration
module.exports = (api) => {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      // Applies the react-refresh Babel plugin on non-production modes only
      !api.env('production') && 'react-refresh/babel',
      // loadable component to work
      '@loadable/babel-plugin',
      // this allows Babel to parse dynamic imports so webpack can bundle them as a code split
      '@babel/plugin-syntax-dynamic-import',
      // require the Babel runtime as a separate module to avoid duplication
      '@babel/plugin-transform-runtime',
    ].filter(Boolean),
  };
};
