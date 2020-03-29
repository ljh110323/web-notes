//webpack 是基于nodeJS的
// 要使用CommonJS规范导出一个对象

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

//? 单页面入口打包 也就是SPA
module.exports = {
  // webpack执行入口
  // entry: "./src/index.js",
  entry: {
    index: "./src/index.js",
    list: "./src/list.js",
    detail: "./src/detail.js"
  },
  // 输出
  output: {
    // 输出到哪里，必须是绝对路径
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js"
  },
  //模式
  mode: "development",
  //处理模块：
  module: {
    rules: [
      //处理图片
      // ! loader是有执行顺序的，顺序是自右往左。
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8].[ext]",
              outputPath: "images/"
            }
          }
        ]
      },
      {
        test: /\.woff2$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag"
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  // devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    port: 8081,
    open: true,
    hotOnly: true,
    proxy: {
      "/api": {
        target: "http://localhost:9092"
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["index", "list"]
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "list.html",
      chunks: ["list"]
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "detail.html",
      chunks: ["detail"]
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name]_[chunkhash:8].css"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
