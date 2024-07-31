const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    hot: true,
    watchFiles: ['src/**/*'],
    proxy: {
      '^/api': {
        target: 'https://bot.bondarenkoid.dev',
        changeOrigin: true,
        secure: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
})
