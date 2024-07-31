const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      }),
    ],
  },
  devServer: {
    hot: true,
    watchFiles: ['src/**/*'],
    client: {
      overlay: {
        warnings: true,
        errors: true
      }
    },
    proxy: {
      '^/api': {
        target: 'https://bot.bondarenkoid.dev',
        changeOrigin: true,
        secure: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
});