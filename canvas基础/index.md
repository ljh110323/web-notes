#canvas API

## 常见api

### 1. getContex，获取上下文 ctx是画笔

下面是一个简单的模板
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style type="text/css">
        body {
            text-align: center;
            padding-top: 20px;
        }

        canvas {
            box-shadow: 0 0 10px #333;
            margin: 0 auto;
        }
    </style>
</head>

<body onload="draw()">
    <canvas id="myCanvas" width="800" height="600">
        <!-- 如果浏览器不支持canvas，才能看到下面你的文字 -->
        您的浏览器版本太低，请更新至最新版本，建议使用Google Chrome。
    </canvas>
    <script>

        function draw(){
            var canvas = document.getElementById('myCanvas');
            if (canvas.getContext) {
                // canvas.getContext,获取上下文， ctx就是画笔 有这个属性，说明浏览器支持，然后写代码
                var ctx = canvas.getContext('2d');
            }
        }

    </script>
</body>

</html>
```

### 2. ctx.fillRect(x, y, width, height)  画矩形

### 3. ctx.fillStyle = 'rgb(200,0,0)', 设置矩形颜色

### 4. ctx.strokeStyle = "red", 设置矩形线框颜色

### 5. ctx.strokeRect(x,y,width,height), 画矩形线框，描边矩形

### 6. ctx.clearRect(x,yh,width,height), 清除矩形区域 

### 7. ctx.,画线，路径

步骤：
1. 首先，创建起始点
2. 使用画图命令，画出路径
3. 把路径闭合
4. 通过描边或填充绘制图层

API方法：
1. ctx.beginPath(), 设置路径开始
2. ctx.moveTo(x,y), 移动画笔到某位置
3. ctx.lineTo(x,y), 画直线, 多条直线连接，需要联系设置调用多次。
4. ctx.closePath(), 闭合画笔，设置结束路径
5. ctx.stroke(), 路径描边
6. ctx.fill(), 路径填充


例如，绘制一个三角形：

```
/*
第一种方案，最后一次lineTo(x,y)位置回到起点
*/ 
ctx.beginPath();
//起始1点x=75, y=50
ctx.moveTo(75,50);
// 2点 x=100, y=50
ctx.lineTo(100,75);
// 3点 x=100, y=25
ctx.lineTo(100,25);
//回到点1
// ctx.lineTo(75,50);
// 填充
//ctx.fill();
//描边
ctx.stroke();


/*
第二种方案，使用closePath(),将路径闭合,并且将画笔移动到起点
*/
ctx.beginPath();
//起始1点x=75, y=50
ctx.moveTo(75,50);
// 2点 x=100, y=50
ctx.lineTo(100,75);
// 3点 x=100, y=25
ctx.lineTo(100,25);
//回到点1
// ctx.closePath();
// 填充
//ctx.fill();
//描边
ctx.stroke();
```

### 8. ctx.fill(), 填充

ctx.fill() 填充就是把，lineTo(x,y) 围起来的路径填充起来。默认是黑色

### 9. ctx.stroke(), 描边

ctx.stroke() 描边就是，对lineTo(x,y) 的路径进行描绘。 只是描边的过程。 所以如果图形效果想要一个闭合图形，最后一次lineTo(x,y) 要回到起点，或者使用ctx.closePath(),closePath()相当于把最后一次的位置和起点连接接起来

### 10. ctx.lineWidth = 2，设置画笔宽度

### 11. ctx.arc(x,y,半径radius，开始角度startAngle,结束角度endAngle,顺/逆时针布尔值anticlockwise)，`画圆`

画圆需要这些：
1. 圆心(x,y), 
2. 半径, radius
3. 开始角度： 默认三点钟，顺时针45°角方向 Math.PI
4. 结束角度， Math.PI = 180°
5. 顺时针/逆时针：布尔值 ,默认是false,顺时针

在画多个圆之前先，执行一次ctx.beginPath();否则会有连线。或者执行moveTo(x,y);

如果是一个图案的画建议使用moveTo(x,y)


### 12. 线性渐变

createLinearGradient参数： 
```
参数1:起点x1
参数2:起点y1
参数3:结束点x2 
参数4: 结束点y2
```
addColorStop参数: number: 0.0~1.0，表示颜色所在的相对位置，color：颜色值

```
var lingrad = ctx.createLinearGradient(x1, y1, x2, y2);
var lingrad = lingrad.addColorStop(number, 'color');

var lingrad = ctx.createLinearGradient(0, 0, 0, 150);
lingrad.addColorStop(0, '#cc6677');
lingrad.addColorStop(0.5, '#fff');
lingrad.addColorStop(0.5, '#c6c7c6');

var lingrad2 = ctx.createLinearGradient(0,50,0,90);
lingrad2.addColorStop(0.5,'#000');
lingrad2.addColorStop(1,'rgba(0,0,0,0)');

ctx.fillStyle = lingrad;
ctx.fillRect(10,10,130,130)

ctx.strokeStyle = lingrad2;
ctx.strokeRect(50,50,50,50);
```

### 13. 径向渐变

createRadialGradient参数：
```
参数1：起点x1，
参数2：起点y1，
参数3：r1半径，x1，y1代表r1的圆心
参数4：x2轴
参数5：y2轴
参数6：r2半径，可以不写，x2，y2代表r1的圆心

```

示例：
```
var radgrad = ctx.createRadialGradient(45, 45, 10, 50, 52, 30);
radgrad.addColorStop(0, '#a7d30c');
radgrad.addColorStop(0.9, '#019f62');
radgrad.addColorStop(1, 'rgba(1,159,98,0)');
ctx.fillStyle = radgrad;
ctx.fillRect(0,0,150,150);

var radgrad2 = ctx.createRadialGradient(105, 105, 20, 112, 120, 50);
radgrad2.addColorStop(0, '#ff5f98');
radgrad2.addColorStop(0.9, '#ff0188');
radgrad2.addColorStop(1, 'rgba(255,1,136,0)');
ctx.fillStyle = radgrad2;
ctx.fillRect(0,0,150,150);
```

### 14. 绘制图片

绘制图片前需要先加载图片
1. createPattern 用的较少
```

//1. createPattern 用的较少
var img = new Image();
img.src = './src/img.jpg';
img.onload = function(){
    var ptrn = ctx.createPattern(img,'no-repeat');
    ctx.fillStyle = ptrn;
    ctx.fillRect(0,0,800,600);
}

```
2. drawImage(),常用

```
ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```
参数：
```
//三种适用方式，注意看值的位置，使用方式不同，值的位置也不同
drawImage(image, dx, dy) 在画布指定位置绘制原图，图片多大就绘制多大 
drawImage(image, dx, dy, dw, dh) 在画布指定位置上按原图大小绘制指定大小的图
drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) 剪切图像，并在画布上定位被剪切的部分：
```
```
image： 图片元素，可以是 img.onload = function(){ console.log(this) } 里面的this
sx： 裁剪的起点x
sy： 裁剪的起点y
sWidth：裁剪的宽度，裁剪的宽度是基于原图尺寸。
sHeight：裁剪的高度，裁剪的高度是基于原图尺寸。
dx：图片显示的起点x
dy：图片显示的起点y
dWidth：图片显示的width
dHeight：图片显示的height
```

```
var img = new Image();
img.src = './src/img.jpg';

img.onload = function(){
    ctx.drawImage(this,0,0,626,550);
    ctx.drawImage(this,0,0,100,100,0,0,100,100);
}
```

### 15. 绘制文字阴影

```
ctx.font = "100px arial";
必须包含以下值：
<font-size>
<font-family>
可以选择性包含以下值：
<font-style>
<font-variant>
<font-weight>
<line-height>
```

```
ar lingrad = ctx.createLinearGradient(100, 200, 500, 200);
lingrad.addColorStop(0.5, '#cc6677');
lingrad.addColorStop(1, '#000');
ctx.shadowColor = 'Orange';
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 20;
ctx.shadowOffsetY = 20;
ctx.font = 'bold oblique 160px arial';

ctx.fillStyle = lingrad;
ctx.fillText('hello1', 100, 200);

```

### 16. 图片裁剪 clip()

先画出一个图形，然后ctx.clip(); 使这个图形去裁剪大小

```
var img = new Image();
img.src = './src/img.jpg';
img.onload = function() {
// ctx.drawImage(this,0,0,626,550);
ctx.beginPath();
    ctx.arc(400,300,150,0,Math.PI*2,false);
    ctx.fill();
    ctx.clip();
    ctx.drawImage(this,0,0);
}
```

### 17. 图形混合

source-over：重叠区域，源图像覆盖目标图像。 
destination-over：重叠区域，目标图像覆盖源图像。 


source-atop：重叠区域，源图像覆盖目标图像。 
destination-atop：重叠区域，目标图像覆盖源图像。 








