process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        indentedSyntax: true,
        data: '@import "~@/assets/sass/shared";'
      }
    }
  },
  chainWebpack: config => {
    // const svgRule = config.module.rule('svg')
    // svgRule.uses.clear()
    // svgRule.use('vue-svg-loader').loader('vue-svg-loader')
  }
}
