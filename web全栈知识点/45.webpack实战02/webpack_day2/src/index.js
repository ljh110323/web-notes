//! es新特性的库 完整的
// import "@babel/polyfill";
//mock数据
// 项目 需求评审 前端给出工时，服务端给出接口文档时间
// 拿到接口文档 mock接口 mock数据

// import axios from "axios";

// axios.get("/api/info").then(res => {
//   console.log(res);
// });

//! HMR支持style-loader css处理方式，不支持抽离成独立文件的方式
// import("./index.css");

// var btn = document.createElement("button");
// btn.innerHTML = "新增!!!";
// document.body.appendChild(btn);

// btn.onclick = function() {
//   var div = document.createElement("div");
//   div.innerHTML = "item";
//   document.body.appendChild(div);
// };

// import counter from "./counter.js";
// import number from "./number.js";
// counter();
// number();

// ? js模块 HRM 需要手动监听需要HRM的模块，当该模块的内容发生改变，会触发回调

// if (module.hot) {
//   module.hot.accept("./number.js", function() {
//     console.log("这个模块改动了");
//     document.body.removeChild(document.getElementById("number"));
//     number();
//   });
// }

// babel ->分析依赖 ->AST(抽象语法树) ->通过语法转换规则转换代码 -> 生成代码
// const arr = [new Promise(() => {}), new Promise(() => {})];

// arr.map(item => {
//   console.log(item);
// });

// import React, { Component } from "react";
// import ReactDom from "react-dom";

// class App extends Component {
//   render() {
//     return <div>hello world</div>;
//   }
// }

// ReactDom.render(<App />, document.getElementById("app"));
console.log("index page");
