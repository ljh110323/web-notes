class CopyrightWebpackPlugin {
  //接收参数
  //   constructor(options) {
  //     console.log(options);
  //   }

  //compiler：webpack实例
  apply(compiler) {
    //emit 生成资源文件到输出目录之前
    compiler.hooks.emit.tapAsync(
      "CopyrightWebpackPlugin",
      (compilation, cb) => {
        console.log(compilation.assets);
        compilation.assets["copyright.txt"] = {
          // 文件内容
          source: function() {
            return "hello copy";
          },
          // 文件大小
          size: function() {
            return 20;
          }
        };
        // 完成之后 走回调，告诉compilation事情结束
        cb();
      }
    );
    // 同步的写法;
    compiler.hooks.compile.tap("CopyrightWebpackPlugin", compilation => {
      console.log("开始了");
    });
  }
}
module.exports = CopyrightWebpackPlugin;
