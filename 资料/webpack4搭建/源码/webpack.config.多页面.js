let path = require('path');
let HtmlWebpackPlugin=require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    admin: './src/admin.js'
  },
  output:{
    filename: 'js/[name].js', //多页面不能写死，需要用[name]获取，name值是entry里面的key值。
    path: path.resolve('dist'),
    publicPath: '/' //打包后的公共路经。
  },
  devServer: {
    port: 8081,
    host: 'localhost', 
    progress: true,
    contentBase: './dist', 
    open: true, 
    compress: true 
  }, 
  plugins:[ //配置这个模板后contentBase:"./build"不生效
  new HtmlWebpackPlugin(
    {
      template:"./public/index.html",     //生成两个看不到的文件
      filename:"index.html",
      chunks:['index'],//只引用index.js,解决index.html里面有index.js和admin.js的问题
      //生产环境下压缩index.html模板
      minify:{
        //removeAttributeQuotes:true, //去除html双引号true去除双引号
        collapseWhitespace:true  //折叠换行true不换行
      },
      hash:true //生产环境下生成hash戳
    }
  ),
  new HtmlWebpackPlugin(
    {
      template:"./public/admin.html",
      filename:"admin.html",
      chunks:['admin'], //这里引用的是entry里面的admin
      minify:{
        collapseWhitespace:true
      },
      hash:true
    }
  ),
],
}