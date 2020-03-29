const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const tarverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");

module.exports = {
  //分析模块 获得AST
  getAst: fileName => {
    let content = fs.readFileSync(fileName, "utf-8");
    return parser.parse(content, {
      sourceType: "module"
    });
  },

  //获取依赖
  getDependcies: (ast, fileName) => {
    const dependcies = {}; //可以保留相对路径和根路径两种信息
    tarverse(ast, {
      ImportDeclaration({ node }) {
        // denpendcies.push(node.source.value); 相对路径
        const dirname = path.dirname(fileName);
        const newPath = "./" + path.join(dirname, node.source.value);
        dependcies[node.source.value] = newPath;
      }
    });
    return dependcies;
  },

  //转换代码
  getCode: ast => {
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"]
    });
    return code;
  }
};
