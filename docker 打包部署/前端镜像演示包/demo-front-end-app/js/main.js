window.onload= function(){
    var btn = document.querySelector('#btn');
    var div_dom = document.querySelector('.box');
    var flag = true;
    btn.onclick = function(e){
        if(flag){
            e.target.innerHTML= "点击我, 开始"
            div_dom.classList.add('rotateX-running');
        }else{
            e.target.innerHTML= "点击我, 暂停"
            div_dom.classList.remove('rotateX-running');
        }
        flag = !flag;
        // console.log(e.target.innerHTML= "点击我关闭");
    }
}
