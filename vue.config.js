process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        indentedSyntax: true,
        data: '@import "~@/assets/sass/shared";'
      }
    }
  }
}
