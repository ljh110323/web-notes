module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  },

  devServer: {
    disableHostCheck: true,
    compress: true,
    port: 5000,
    proxy: {
      '/api/': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        //pathRewrite: {
        //  '^/api': ''
        //}
      },

    },
    // historyApiFallback: {
    //   index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    // },

    overlay: {
      errors: true, // 编译出现错误时，错误直接贴到页面上
    },
    quiet: true, // 不显示 devServer 的 Console 信息，让 FriendlyErrorsWebpackPlugin 取而代之
  },
}