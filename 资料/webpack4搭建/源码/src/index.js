import './assets/style/index.less';
// import img1 from "./assets/images/1.png";
// import img2 from "./assets/images/2.png";

// console.log('index page');

// let image=new Image();  //要用var不要用let定义，因为uglifyjs(js压缩)不支持es6
// image.src = img1;
// // image.src = img2;
// document.body.appendChild(image);


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

ReactDOM.render(<App />, document.getElementById("root"));


