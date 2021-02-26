# webpack 4 搭建使用

## webpack作用

1. 代码转换
>es6转化成es5
2. 文件优化
3. 代码分割
4. 模块合并
5. 自动刷新
6. 代码校验
7. 自动发布

## 1. 初始框架搭建
1. 初始化项目，生成package.json文件
```
npm init --yes
```
2. 安装 webpack 和 webpack-cli（脚手架）
```
npm install --save-dev webpack webpack-cli
```
* --save-dev 可以用 -D 代替，保存到package.json文件的devDependencies里面去，开发环境插件依赖
* --save 可以用 -S 代替，保存到package.json文件的dependencies里面去，项目执行插件依赖

3. 执行命令，测试是否安装成功, 初次会报错，是正常的，不用管,是因为项目现在是空项目，什么都没有。
```
npx webpack 
```
npx 命令是直接调用 mode_modules 里面的.lib文件夹里面的webpack命令

4. 给package.json 添加命令脚本
```
 "scripts": {
    "build": "webpack --config webpack.config.js"
  },
```
在"scripts" 里面添加的脚本，可以通过 npm run XXX执行，上面build命令执行方式如下：

> npm run build

5. 项目根目录下 新建webpack.config.js文件内容如下

```
let path = require('path');

module.exports = {
  mode: 'development', //模式 development 和 production ,生产环境不压缩，开发环境压缩bundle.js代码
  entry: './src/index.js', //主入口文件，
  output: {
    filename: 'js/index.js', //打包后的文件名。在dist/js/index.js
    path: path.resolve('dist') //必须是一个绝对路径
  }, //打包后的生成的文件
  // resolve: {}, // 别名+省略后缀等
  // module: {}, //模块，主要是loader，把所有文件转换成js
  // plugins:[], //插件，只要是执行module里面的loader。
  // devServer: {}, //配置开发服务器。它本身和对项目代码没有任何影响。不用他用其他的server 也没任何问题
}
```

6. 根目录下新建src文件夹,src里面新建index.js文件。
```
|-node_modules
|-src
  |-index.js
|-webpack.config.js  
|-package.json
```
执行 `npm run  build` 就会在 根目录下生产一个dist文件里，里面有js/index.js文件.
此文件就是打包后的文件。对应的就是webpack.config.js 里面的`output.filename` 和 `output.path`,
两个属性的值。

## 2. html-webpack-plugin HTML模板
html-webpack-plugin可以为项目将一个html模板文件 生产到项目dist目录中去。

1. 下载
```
npm i -D html-webpack-plugin
```

2. 根目录下新建一个模板文件。 /public/index.html
```
|-node_modules
|-public
  |-index.html
|-src
  |-index.js
|-webpack.config.js  
|-package.json
```
3. 在webpack.config.js中添加配置如下

```
let HtmlWebpackPlugin=require("html-webpack-plugin");

module.exports = {
  mode: ...,
  entry: ...,
  output: ...,
  devServer: ...,
  plugins:[
    //配置这个模板后contentBase:"./dist"不生效
    new HtmlWebpackPlugin(
      {
        template:"./public/index.html",       //关联咱们模板html文件
        filename:"index.html",  //生产的文件名字。默认位置在output.path文件夹中，这里是'dist'文件夹
        minify:{
          collapseWhitespace:true //折叠换行true不换行
        },
        hash:true //生产环境下生成hash戳
        //如果加了hash，就会在生成的dist/index.html文件里面<script>后面添加hash戳
        //<script type="text/javascript" src="js/index.js?8458af100af1280717b0"></script>
      }
    )
  ]

```
然后执行 `npm run build` 就会在dist目录下生成一个index.html文件

## 3. webpack-dev-server安装和配置
webpack-dev-server是webpack内置的一个serve服务器，主要方便本地在线开发。

1. 下载

```
npm i -D webpack-dev-server
```
安装成功后使用如下命令测试：
```
npx webpack-dev-server
```
默认会启动一个`http://localhost:8080/`的服务地址, 在游览器上输入可以访问。

2. 在package.json 配置

```
"scripts": {
    "build": "webpack --config webpack.config.js",
    "dev": "webpack-dev-server"
  },
```


3. 在webpack.config.js中添加devServer配置如下

```
module.exports = {
  mode: ...
  entry: ...
  output: ...
  devServer: {
    port: 8081, //默认启动的端口号
    host: 'localhost', 
    //ip地址，localhost 是本地，0.0.0.0 可以访问网络，
    //同一局域网其他用户可以访问到当前主机ip网址
    //也可以使用192.168.1.75 自己的IP地址。
    //windows系统下有可能其他电脑无法访问，需要关闭防火墙
    progress: true, //开启控制台编译进度条
    contentBase: './dist', //默认打开的目录 根目录下的/dist文件夹
    //如果使用了 HtmlWebpackPlugin 插件就可以不用再这里配置了
    //contentbase代表html页面所在的相对目录，如果我们不配置项，
    //devServer默认html所在的目录就是项目的根目录.
    //他会优先去寻找index.html文件
    open: true, // 自动打开浏览器查看结果，一般不开
    compress: true //启用gzip压缩
  },
  plugins:[...],
}

```
这里需要注意一点，contentBase的路径是相对与webpack.config.js文件所在的目录的，有的时候，我们习惯将webpack配置文件统一放着一个build文件下，这个时候我们在写contentBase路径的时候就需要注意了。

4. 代理模式-解决本地开发跨域。
在现实开发中，往往需要前后端联调。如果后端接口没开跨域，就需要前端这边使用代理，才能访问到后端接口。

```
devServer:{
  ...,
  ...,
  proxy: {
            '/api': {  //别名
                target: 'http://10.0.193.147:8080/api', //api后面没有/符号
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/api': '' //需要rewrite的, 和别名保持一致就可以
                }
            }
        }
}
```
现在有一个后端接口 `http://10.0.197.52:8080/api/aaa/bbb`, 他都是以 `http://10.0.197.52:8080/api` 开头, 我们就可以使用proxy, 代理 `http://10.0.197.52:8080/api` 下的所有接口。

使用方法：
```
// `/api` 就代替了http://10.0.193.147:8080/api, 
// 因为/api/aaa 中间已经有一个/了，所以上面target那里不写/
this.axios.get('/api/aaa/bbb')
.then(res=>{
  console.log(res);
})
```
## 4. 多页面应用配置(选配)
从大多数情况来说，现在web开发主流是单页面应用(SPA), 但是webpack还是提供了多页面开发配置模式，方便进行，多页面应用的打包。

以下内容为选配，如果页面是单页面，就不需要。

新建`src/admin.js`和`public/admin.html`两个文件
1. 修改为多入口

```
module.exports = {
 entry: {
   index: './src/index.js',
   admin: './src/admin.js'
 }
}
```
2. output.filename值改为 `[name].js`

```
module.exports = {
 entry: {
   index: './src/index.js',
   admin: './src/admin.js'
 },
 output:{
   filename: '[name].js', //多页面不能写死，需要用[name]获取，name值是entry里面的key值。
   path: path.resolve('dist'),
   publicPath: '/'  //打包后的公共路经。
 }
}
```

3. 配置html模板插件

```
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

```

核心是 new了两个HtmlWebpackPlugin，使用chunks 将js区分开。

执行`npm run build`可以看到在dist目录下生成了index.html和admin.html。在dist/js 生成了index.js和admin.js 文件。

运行`npm run dev` 可以直接访问`http://localhost:8081/index.html`和`http://localhost:8081/admin.html`;

## 5. 项目添加二级子域名(选配)
在实际项目部署中，我们的项目经常不是部署在根url`ip:8080`上，而是部署`ip:8080/app/` 路径上。

当然也会有`ip:8080/bpp/` `ip:8080/cpp/` 等等。那么我们怎么保证代码不做过多的修改就可以访问了呢？


我们可以在webpack 中配置`publicPath`,具体用法如下：

```
output:{
   filename: 'js/index.js', 
   path: path.resolve('dist'),
   publicPath: '/'  //打包后的公共路经。
 }
```

1. 不加 `publicPath` 的效果
```
output:{
   filename: 'js/index.js', 
   path: path.resolve('dist'),
   //publicPath: '/'  //打包后的公共路经。
 }
```

在dist/index.html文件中。`js/index.js`前面没有斜杠。

```
<script type="text/javascript" src="js/index.js?f0579711997629b34fd4"></script>
```
2. 加 `publicPath: '/'` 的效果
```
output:{
   filename: 'js/index.js', 
   path: path.resolve('dist'),
   publicPath: '/'  //打包后的公共路经。
 }
```

在dist/index.html文件中。`js/index.js`前面有斜杠。

```
<script type="text/javascript" src="/js/index.js?f0579711997629b34fd4"></script>
```

3. 区别对比

先推荐一个专门启动静态打包后资源的服务器，方便好用。
```
npm i -g serve
```
使用方式，在想要启动的目录下直接输入`serve`,就会自动分配ip等。很适合对dist静态资源进行测试。 

区别：
* 静态访问下，1中可以访问到index.js文件，而2中访问不到。console.log(会报错);
> 直接由游览器打开

* 如果实在服务器根目录下部署访问，1和2都可以访问到js。

> 直接在dist目录下启动 `serve`

* 但是如果服务器有二级域名比如`ip:5000/demo`,则1和2都访问不到,错误如下

> 在 dist文件夹里面新建demo文件夹，然后将dist文件夹里面男的东西直接copy到demo里面去。
然后再在dist目录级别启动`serve`

```
GET http://localhost:5000/js/index.js?8afec36835c703a52de3 net::ERR_ABORTED 404 (Not Found)
```
可以看到，代码其实访问的还是/js/下的index.js, 而我们期望的是它访问`http://localhost:5000/demo/js/index.js`

4. 正确用法

```
output:{
   filename: 'js/index.js', 
   path: path.resolve('dist'),
   publicPath: '/demo'  //打包后的公共路经。
 }
```

然后build之后的包，
```
<script type="text/javascript" src="/demo/js/index.js?ff29340cb551ead7da77"></script>
```

## 6. 添加loaders

webpack中有一项很重要的配置loaders, 他提供了可以让webpack和程序代码可以加载css，图片，字体，js，文件等功能。其原理就是把这些资源编程js可以识别的语言。然后在做下一步处理。例如在plugins:[]中处理。

以下列举了一些常见的loader。

### 1.  加载css loader

> 引入css-loader

```
npm install -D css-loader style-loader mini-css-extract-plugin
```
* css-loader: 解析@import这类语法。
* style-loader: 把css 插入到header中。
* mini-css-extract-plugin: 抽离css样式让index.html里面的css样式变成link引入。

* loader是有顺序的默认从右向左执行,从下往上执行。

* loader可以写成字符串：use:'css-loader'，写成数组['css-loader']，写成对象[{loader:'css-loader'}]对象的好处可以传好多参数。

```
let MiniCssExtractPlugin=require('mini-css-extract-plugin');

module.exports = {
  ...,
  ...,
  module:{
    rules:[
      {
        test:/\.css$/,
        use:[
            MiniCssExtractPlugin.loader,//都放到了下面plugins的index.css里面
            {
                loader:"css-loader",
            }
        ]
      }
    ]
  },
  plugins:[
    ...,
    ...,
    new MiniCssExtractPlugin({
      filename:'css/index.css' //把css打包到dist/css/index.css中
    })
  ]
}
```

> 引入less-loader

```
npm install -D less-loader less
```
配置如下，只需要在rule里面添加上less-loader，再修改一下正则校验test规则即可：
```
let MiniCssExtractPlugin=require('mini-css-extract-plugin');

module.exports = {
  ...,
  ...,
  module:{
    rules:[
       {
        test:/\.(css|less)$/,
        use:[
            MiniCssExtractPlugin.loader,//都放到了下面plugins的index.css里面
            {
              loader:"css-loader",
            },
            {
              loader:"less-loader",
            },
        ]
      }
    ]
  },
  plugins:[
    ...,
    ...,
    new MiniCssExtractPlugin({
      filename:'css/index.css' //把css打包到dist/css/index.css中
    })
  ]
}
```
sass 等其他预编译css处理器 同理。

> 引入postcss 处理浏览器兼容性

虽然现在市面上大多数浏览器已经支持css3, 但是还是有一些特殊的PC浏览器和手机端，需要在一些新css属性加上前缀。如：`-webkit-`。

下载：
```
npm install -D postcss-loader autoprefixer
```

用法1：

```
// require('autoprefixer')({}) 
// 相当于let autoprefixer = require('autoprefixer')
//  然后再autoprefixer({...})
let postCss=require('autoprefixer')({
     "overrideBrowserslist": [
          'last 10 Chrome versions',
          'last 5 Firefox versions',
           'Safari >= 6',
           'ie> 8'
      ]
})

module.exports = {
  ...,
  ...,
  module:{
    rules:[
       {
        test:/\.(css|less)$/,
        use:[
            MiniCssExtractPlugin.loader,//都放到了下面plugins的index.css里面
            {
              loader:"css-loader",
            },
            {
             loader:'postcss-loader',
               options: {
                  plugins:[
                     postCss
                  ]
              }
            },
            {
              loader:"less-loader",
            }
            
        ]
      }
    ]
  }
}


```

用法2：

```
module.exports = {
  ...,
  ...,
  module:{
    rules:[
       {
        test:/\.(css|less)$/,
        use:[
            MiniCssExtractPlugin.loader,//都放到了下面plugins的index.css里面
            {
              loader:"css-loader",
            },
            {
             loader:'postcss-loader',
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
      }
    ]
  }
}

```
跟目录下新建一个 postcss.config.js,内容如下：
```
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
};
```
在package.json文件中写入：

```
{
"browserslist": [
    "defaults",
    "not ie < 11",
    "last 2 versions",
    "> 1%",
    "iOS 7",
    "last 3 iOS versions"
  ]
}
```

### 2. css 压缩

下载
```
npm install -S optimize-css-assets-webpack-plugin
```

使用：
```
let OptimizeCss = require('optimize-css-assets-webpack-plugin');
module.exports = {
  ...,
  ...,
  optimization: {//优化项启动后mode模式代码压缩不再生效，必须配置js压缩插件
    minimizer: [
         new OptimizeCss()//优化css
   ]
  }
}
```
### 3. js压缩

下载
```
npm install -S uglifyjs-webpack-plugin
```
使用：
```
let UglifyjsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  ...,
  ...,
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
```

### 4. 加载图片文字等资源。

下载：
```
npm install -S url-loader file-loader
```

使用：
```
module:{
      rules: [       
         {
            test:/\.(jpe?g|png|gif|mp4)$/,
            use:{
                loader:"url-loader", //file-loader加载图片，url-loader图片小于多少k用base64方式显示
                options: {
                    limit:100*1024, //小于100k用base64
                    //build之后的目录分类
                    outputPath:'static/images'                    },
            }
          },
          {
            test: /\.(eot|ttf|woff|svg)$/, //加载字体资源
            use: 'file-loader'
          },
       ]
}

```

base64类似于，可以直接在游览器F12 DOM 上看：
```
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUh...cCjyfKLD/gAAAABJRU5ErkJggg==">
```
特别说明：

base64的特点：
* 1. base64是存在于css 和js文件中，可以减少网络请求。他就是文本。
* 2. base64会导致css+js文件变大。
* 3. 低版本浏览器不支持。
根据现在整体网络大环境来看，建议100K以下的图片适应base64,也有建议10k以下的图片采用base64格式。


### 5. babel-loader ES6转ES5 
正常情况下webapck只支持对es5的打包，针对es6的一些特性。需要引用babel来进行解析。

下载：
```
npm install --save babel-loader @babel/core @babel/preset-env @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime @babel/runtime @babel/polyfill
```

* babel-loader : babel加载器
* @babel/core : babel 核心文件。
* @babel/preset-env :  es6转es5,但是只能转基础的。
* @babel/polyfill : 主要提供一些高阶es6的用法 如 Array.from()。
* @babel/plugin-proposal-class-properties : 支持es6,class Goods类语法。
* @babel/plugin-transform-runtime : 编译模块的工具函数。
* @babel/runtime : es6转es5时babel 会需要一些辅助函数，例如 _extend。这样文件多的时候，项目就会很大。所以 babel 提供了 transform-runtime 来将这些辅助函数“搬”到一个单独的模块 babel-runtime 中，这样做能减小项目文件的大小。

以下为非必须，按需加载。。。

* @babel/plugin-proposal-decorators : 转换装饰器。
* @babel/plugin-proposal-export-default-from : 将导出default编译为ES2015。
* @babel/plugin-syntax-dynamic-import : 允许解析import() 语法。
* @babel/traverse : 模块维护整个树状态，并负责替换，删除和添加节点。
* @babel/generator : 
* @babel/parser : 
* @babel/plugin-transform-react-constant-elements : 
* @babel/preset-react : 
* @babel/types : 
* babel-eslint : 
* babel-plugin-import : 
* babel-plugin-styled-components : 

使用：

```
 {
      test:/\.js$/,//支持require('*.js')文件
      use:{
          loader:'babel-loader',
          options:{//用babel-loader 需要把es6-es5
              presets:[
                  '@babel/preset-env'
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
```

### 6. 搭建React环境

下载：

```
//安装react模块
npm i react react-dom --save

//安装react的解析模块
npm i babel-preset-react --save-dev

安装所需要的babel：
npm install babel-loader@next @babel/core @babel/preset-react @babel/runtime --save

```

配置webpack.config.js
```
{                
    test:/\.js$/,
    use:{                    
        loader:'babel-loader',                    
        options:{
            presets:[                           
              '@babel/preset-env','@babel/preset-react' //增加@babel/preset-react           
            ]                    
      }               
 }

```
以下可选：
```
module.exports={   
//关闭 webpack 的性能提示
     performance: {
          hints:false
      },
}

```

在index.js写入react代码：
```
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component{
    render(){
        return(
            <div>Hello React!</div>
    )
    }
}
export default App;

ReactDOM.render(<App />, document.getElementById("app"));
```

运行`npm run dev`就可以在页面上看到 Hello React!


### 7. devtool 配置
开发环境推荐使用：

1.eval ：每个模块使用eval()和//@ sourceURL执行。这是非常快。主要缺点是，它没有正确显示行号，因为它被映射到转换代码而不是原始代码(没有来自加载器的源映射)。

2.`eval-source-map`：每个模块使用eval()执行，而SourceMap作为DataUrl添加到eval()中。最初它是缓慢的，但是它提供快速的重建速度和产生真实的文件。行号被正确映射，因为它被映射到原始代码。它产生了最优质的开发资源。

3.cheap-eval-source-map：与eval-source-map类似，每个模块都使用eval()执行。它没有列映射，它只映射行号。它忽略了来自加载器的源代码，并且只显示与eval devtool相似的经过转换的代码。

4.cheap-module-eval-source-map：类似于cheap-eval-source-map，在本例中，来自加载器的源映射被处理以获得更好的结果。然而，加载器源映射被简化为每一行的单个映射。

生产环境推荐使用：

1.(none) ：(省略devtool选项)-不触发SourceMap。这是一个很好的选择。

2.`source-map`：一个完整的SourceMap是作为一个单独的文件。它为bundle 添加了引用注释，因此开发工具知道在哪里找到它。

3.hidden-source-map：与source-map相同，但不向bundle 添加引用注释。如果您只希望SourceMaps从错误报告中映射错误堆栈跟踪，但不想为浏览器开发工具暴露您的SourceMap，可以使用此选项。

4.nosources-source-map：一个SourceMap是在没有源代码的情况下创建的。它可以用于在客户机上映射堆栈跟踪，而不暴露所有源代码。您可以将源映射文件部署到webserver。
























