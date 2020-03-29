// entry: {
//   index: "./src/index.js",
//   list: "./src/list.js",
//   detail: "./src/detail.js"
// },

// new HtmlWebpackPlugin({
//     template: "./src/index.html",
//     filename: "detail.html",
//     chunks: ["detail"]
//   }),
const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const setMpa = () => {
  const entry = {};
  const htmlwebpackplugin = [];

  //! 分析入口文件路径
  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));

  entryFiles.map((item, index) => {
    const entryFile = entryFiles[index];
    //! 过滤信息拿到入口名称
    const match = entryFile.match(/src\/(.*)\/index\.js/);

    const pageName = match && match[1];
    entry[pageName] = entryFile;

    //! 配置htmlplugin
    htmlwebpackplugin.push(
      new HtmlWebpackPlugin({
        template: `src/index.html`,
        filename: `${pageName}.html`,
        chunks: [pageName]
      })
    );
  });

  console.log(entry);

  return {
    entry,
    htmlwebpackplugin
  };
};

const { entry, htmlwebpackplugin } = setMpa();

module.exports = {
  // entry: "./src/index.js",
  entry,
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name]_[chunkhash:8].js"
  },
  mode: "development",
  plugins: [...htmlwebpackplugin]
};
