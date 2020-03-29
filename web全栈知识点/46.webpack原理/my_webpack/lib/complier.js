const fs = require("fs");
const path = require("path");
const { getAst, getDependcies, getCode } = require("./parser.js");
module.exports = class Complier {
  constructor(options) {
    this.entry = options.entry;
    this.output = options.output;
    this.modules = [];
  }
  run() {
    const info = this.build(this.entry);
    this.modules.push(info);

    for (let i = 0; i < this.modules.length; i++) {
      const item = this.modules[i];
      const { dependencies } = item;
      if (dependencies) {
        for (let j in dependencies) {
          this.modules.push(this.build(dependencies[j]));
        }
      }
    }
    //转换数据结构
    const obj = {};
    this.modules.forEach(item => {
      obj[item.fileName] = {
        dependencies: item.dependencies,
        code: item.code
      };
    });
    //生成代码文件
    this.file(obj);
  }
  build(fileName) {
    let ast = getAst(fileName);
    let dependencies = getDependcies(ast, fileName);
    let code = getCode(ast);
    return {
      fileName,
      dependencies,
      code
    };
  }
  file(code) {
    //获取输出信息 .../dist/main.js
    const filePath = path.join(this.output.path, this.output.filename);
    const newCode = JSON.stringify(code);
    const bundle = `(function(graph){
        function require(module){
            function localRequire(relativePath){
               return require(graph[module].dependencies[relativePath])
            }
            var exports = {};
            (function(require,exports,code){
                eval(code)
            })(localRequire,exports,graph[module].code)
            return exports;
        }
        require('${this.entry}') //./src/index.js
    })(${newCode})`;

    fs.writeFileSync(filePath, bundle, "utf-8");
  }
};
