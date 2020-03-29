const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const tarverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");

module.exports = class Complier {
  constructor(options) {
    this.entry = options.entry;
    this.output = options.output;
  }
  run() {
    this.build(this.entry);
  }
  build(entryFile) {
    //entryFile ./src/index.js
    //1.分析入口,读取入口模块的内容
    let content = fs.readFileSync(entryFile, "utf-8");
    const ast = parser.parse(content, {
      sourceType: "module"
    });

    // const denpendcies = [];
    const denpendcies = {}; //可以保留相对路径和根路径两种信息
    tarverse(ast, {
      ImportDeclaration({ node }) {
        // denpendcies.push(node.source.value); 相对路径
        const dirname = path.dirname(entryFile);
        const newPath = "./" + path.join(dirname, node.source.value);
        denpendcies[node.source.value] = newPath;
      }
    });

    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"]
    });
    console.log(code);
  }
};
