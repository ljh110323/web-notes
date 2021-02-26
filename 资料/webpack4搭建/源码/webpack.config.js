let path = require('path');
let HtmlWebpackPlugin = require("html-webpack-plugin");
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let OptimizeCss = require('optimize-css-assets-webpack-plugin');
let UglifyjsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'js/index.js',
    path: path.resolve('dist'),
    publicPath: '/'
    // publicPath: '/demo3'
  },
  module:{
    rules:[
      {
        test:/\.(css|less)$/,
        use:[
            MiniCssExtractPlugin.loader,//都放到了上面的main.css里面
            {
              loader:"css-loader",
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: 'postcss.config.js'  // 这个得在项目根目录创建此文件
                }
              }
            },
            {
              loader:"less-loader",
            },
            
        ]
      },
      {
        test:/\.(png|jpg|gif|jpeg)$/,
        use:{
            loader:"url-loader", //file-loader加载图片，url-loader图片小于多少k用base64显示
            options: {
                limit:10*1024, //小于10k用base64
                outputPath:'images'  //build之后的目录分类                  
            },
        }
      },
      {
          test:/\.js$/,//支持require('*.js')文件
          use:{
              loader:'babel-loader',
              options:{//用babel-loader 需要把es6-es5
                  presets:[
                      '@babel/preset-env','@babel/preset-react'
                  ],
                  plugins:[
                      '@babel/plugin-proposal-class-properties',
                      '@babel/plugin-transform-runtime'
                  ]
              }
          },
          include:path.resolve(__dirname,'src'),//需要转换的文件夹
          exclude:/node_modules/ //排除转换的文件夹
      }
    ]
  },
  devServer: {
    port: 8081,
    host: 'localhost', 
    progress: true,
    contentBase: './dist', 
    open: true, 
    compress: true 
  }, 
  plugins:[
    new HtmlWebpackPlugin(
      {
        template:"./public/index.html",   
        filename:"index.html", 
        minify:{
          collapseWhitespace:true
        },
        hash:true
      }
    ),
    new MiniCssExtractPlugin({
      filename:'css/index.css'
    })
  ],
  optimization: {//优化项启动后mode模式代码压缩不再生效，必须配置js压缩插件
    minimizer: [
         new OptimizeCss(),//优化css
         new UglifyjsPlugin({
          cache:true, //是否用缓存
          parallel:true, //是否并发打包
          sourceMap:true //es6映射es5需要用
         }), 
   ]
  }
}