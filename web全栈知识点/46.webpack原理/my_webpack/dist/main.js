(function(graph){
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
        require('./src/index.js')
    })({"./src/index.js":{"dependencies":{"./hello.js":"./src/hello.js"},"code":"\"use strict\";\n\nvar _hello = require(\"./hello.js\");\n\n// import test from \"./test.js\";\ndocument.write(\"hello\" + (0, _hello.say)(\"webpack\")); //hello webpack\n//获取配置 根据配置信息启动webpack，执行构建\n//1.从入口模块开始分析\n// 有哪些依赖\n// 转换代码\n//2.递归的分析其他依赖模块\n//有哪些依赖\n//转换代码\n//3.生成可以在浏览器端执行的bundle文件"},"./src/hello.js":{"dependencies":{"./a.js":"./src/a.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.say = say;\n\nvar _a = require(\"./a.js\");\n\nfunction say(str) {\n  return str + (0, _a.add)();\n}"},"./src/a.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.add = add;\n\nfunction add() {\n  return \"add\";\n} //./src/index.js"}})