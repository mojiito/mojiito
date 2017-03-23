export default {
  entry: '../dist/all/playground/main.js',
  dest: '../dist/all/playground/bundles/playground.umd.js',
  format: 'umd',
  moduleName: 'playground',
  globals: {
    'mojiito-core': 'mj.core',
    'mojiito-platform-browser': 'mj.platformBrowser'
  },
  context: 'this'
}
