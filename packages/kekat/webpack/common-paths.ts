const { join, resolve } = require('path');

const root = resolve(__dirname, '../');
module.exports = {
  ROOT: root,
  DIST: join(root, 'dist'),
  PATH: join(root, 'dist'),
  SRC: join(root, 'src'),
};
