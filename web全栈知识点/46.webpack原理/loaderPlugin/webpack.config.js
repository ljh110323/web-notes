const path = require("path");
const CopyrightWebpackPlugin = require("./plugins/copyright-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./dist")
  },
  resolveLoader: {
    modules: ["node_modules", "./loaders"]
  },
  //   module: {
  //     rules: [
  //       {
  //         test: /\.js$/,
  //         use: [
  //           {
  //             loader: "replaceLoaderAsync",
  //             options: {
  //               name: "老韩"
  //             }
  //           },
  //           "replaceLoader"
  //         ]
  //       }
  //     ]
  //   },
  plugins: [
    new CopyrightWebpackPlugin({
      name: "kkb"
    })
  ]
};
