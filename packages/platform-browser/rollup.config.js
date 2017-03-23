export default {
  entry: '../../dist/packages-dist/platform-browser/index.js',
  dest: '../../dist/packages-dist/platform-browser/bundles/platform-browser.umd.js',
  format: 'umd',
  moduleName: 'mj.platformBrowser',
  globals: {
    'mojiito-core': 'mj.core'
  },
  context: 'this'
}
