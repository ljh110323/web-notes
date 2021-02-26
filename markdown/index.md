# 目录

1. [基础语法](#1)
2. [高级语法](#2)
3. [好用的HTML标签](#3)
4. [MD转HTMl](#4)

# <a id="1">基础语法</a>


## 1.标题
```
#+空格+标题 
# 这是一级标题
## 这是二级标题
### 这是三级标题
```

## 2.首行缩进
　　
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你好世界水电费进口量啥弗兰克斯就你好世界水电费进口量啥弗兰克斯就你好世界水电费进口量啥弗兰克斯就你好世界水电费进口量啥弗兰克斯就你好世界水电费进口量啥弗兰克斯就

```
&nbsp;&nbsp;中文排版有首行缩进规则，
使用&nbsp;
```
## 3.引用文字
>这是马云说的
```
>+文字
>这是马云说的
```

## 4.斜体
*斜体* <br>
_斜体_ <br>

**粗体** <br>
__粗体__

```
*斜体* <br>
_斜体_ <br>

**粗体** <br>
__粗体__
```

## 5.分割线

4个*号
****

```
4个*号
****
```

## 6.删除线

~~原价：2510~~

```
前后各两个波浪线

~~原价：2510~~
```

## 7.无序列表

* 花生
* 牛奶

+ 花生
+ 牛奶

- 花生
- 牛奶

```
*+空格+文字
* 花生
* 牛奶
*号也可以用 + - 加号减号代替
```

## 8.有序列表

1. 泡面
2. 火腿


```
数字+.+空格+文字
1. 泡面
2. 火腿
```


## 9.连接(links)

markdown中有两种链接方式 *行内式* 和 *参考式*
<br>
行内式（不可见链接）：
[百度一下](https://www.baidu.com/)
<br>
参考式（可见链接）：
百度一下：[https://www.baidu.com/]
```
[name](url)
行内式（不可见链接）：
[百度一下](https://www.baidu.com/)
<br>
参考式（可见链接）：
百度一下：[https://www.baidu.com/]
```

## 10.图片(images)

也有*行内式* 和 *参考式* 两种方式
![风景图](./src/bg.png)
![风景图](src/bg.png)


```
![name](url)
![背景图](./images/bg.jpg)
```

## 11.视频(videos)
利用视频服务器的插入代码，例如：
<iframe height=498 width=510 src='http://player.youku.com/embed/XNDI1MDk3NjE0OA==' frameborder=0 'allowfullscreen'></iframe>

```
<iframe><iframe>
```
## 12.表格
表格用“|”分割，有几列就用几个"|"分割，下面是一个3列的表格

序号|单价|数量
-------|------|-------
1|2|3

## 13.锚点

[锚点目录1](#ml1)<br>
<a id="ml1">目标：目录1</a>


```
[锚点目录1](#ml1)<br>

<a id="ml1">目标：目录1</a>
```

# <a id="2">高级语法</a>

## 1.代码块
```
var a = 10;
var str = 'hello';
```

```
 ` ` `
    var a = 10;
    var str = 'hello';
 ` ` `
```

## 2.反斜杠\

打印星号*：
<br>
\*保留星号\*

# <a id="3">好用的HTML标签</a>

## 1.文字居中

文字居中用\<center>标签来实现
<center><h3>我在居中</h3></center>

```
<center><h3>我在居中</h3></center>
```

## 2.分栏排版

### 2.1 div标签实现(貌似有问题)

```
<div class="pull-left">
imgurl
</div>
文字内容
```

### 2.1 table标签实现
<table>
    <tr>
    <td>
        <img src="src/bg.png"/>
    </td>
    <td>文字内容</td>
    </tr>
</table>

## 3.其他支持的标签

<h1>文字内容</h1>
<br/> 换行
<hr/> 水平线
<b>粗体</b>
<del>删除线</del>
<code>代码块</code>
<strong>加强</strong>
<em>强调</em>
<i>斜体</i>
<blockquote>引用的文本</blockquote>
<a href="www.baidu.com">百度</a>

```
<h1>文字内容</h1>
<br/> 换行
<hr/> 水平线
<b>粗体</b>
<del>删除线</del>
<code>代码块</code>
<strong>加强</strong>
<em>文字强调</em>
<i>斜体</i>
<blockquote>引用的文本</blockquote>
<a href="www.baidu.com">百度</a>
```
# <a id="4">md文件转HTML</a>
## 4.md文件转HTML
先全局安装i5ting_toc
```
npm install -g i5ting_toc
```
在需要转md的文件路径下打开命令工具输入以下命令yourfile.md是你的md文件名称
```
i5ting_toc -f yourfile.md
```
然后在当前目录下会生成一个preview目录
```
文件里会生成一个html文件,生成的html,左侧是目录,右侧是详情
```



