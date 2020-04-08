# mapbox 表达式

## 目录

## 表达式语法和概念

可以将任何layout属性，paint属性或filter的值指定为表达式。

```
[表达式运算符, 参数1, 参数2, ...]
```
参数的值类型：字符串，数字，布尔值，或者另一个表达式数组，null。

也就是说表达式可以嵌套。也就是组合表达式：
例如：
```
//geojson 的 features 参数
"features": [
      {
        "type": "Feature",
        "properties": {
            "id": "1",
            "name":"点1",
            "desc":"这是点1",
            "radius": 10
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            108.9902114868164,
            34.24813554589752
          ]
        }
      }
]


// 根据geojson中 radius 的值来确定圆的半径
"circle-radius": [
    "interpolate", ["linear"], ["zoom"],
    //zoom为 0，半径为radius的值
    0, ['get','radius'],
    //zoom为 10，半径为radius的值，zoom为0-10是按照linear 线性增加。
    10, ['*', ['get','radius'], 10]
]
```

## 表达式类型系统

### `1.下面这段话很重呀，需要仔细阅读`

表达式输入参数和输出结果的类型：boolean,color,string,number,array。来源于 style 规范中的 Types，
表达式的每次使用都具有已知的结果类型和必需的参数类型，并且SDK会验证表达式的结果类型是否适合使用该表达式的上下文，例如，filter属性中表达式的结果类型必须为boolean，+运算符的参数必须为number。

使用要素数据时，SDK通常不会提前知道要素属性值的类型。为了保持类型安全，在评估数据表达式时，SDK将检查属性值是否适合上下文。例如，如果您["get", "feature-color"]对circle-color属性使用表达式，则SDK将验证feature-color每个功能的值是否是标识有效color的字符串。如果此检查失败，将以特定于SDK的方式指示错误（通常是一条日志消息），并且将使用该属性的默认值。

在大多数情况下，此验证将在需要的任何地方自动进行。但是，在某些情况下，SDK可能无法根据周围环境自动确定数据表达式的预期结果类型。例如，不清楚表达式["<", ["get", "a"], ["get", "b"]]是要比较字符串还是数字。在这种情况下，可以使用类型断言表达式运算符之一来指示数据表达式的预期类型：["<", ["number", ["get", "a"]], ["number", ["get", "b"]]]。类型声明检查特征数据是否确实与数据表达式的预期类型匹配。如果此检查失败，则会产生错误，并使整个表达式恢复为所定义属性的默认值。断言运营商array，boolean，number，和string。

表达式仅执行一种隐式类型转换：在期望颜色的上下文中使用的数据表达式会将颜色的字符串表示形式转换为颜色值。在其他情况下，如果你想类型之间的转换，你必须使用一个类型转换表达式运算符：
```
to-boolean: 返回 boolean
to-number: 返回 number
to-string: 返回 string
to-color: 返回 color
```
例如，如果您具有一个功能属性，该属性以字符串格式存储数字值，并且您希望将这些值用作数字而不是字符串，则可以使用诸如的表达式["to-number", ["get", "property-name"]]。

例如对数据中的字符串类型，转换成数字类型：

```
//circle-radius: 的值期望是 number,所以字符串类型会报错

"circle-radius": [
    "interpolate",["linear"],["zoom"],
    0, ['get','radius'],
    10, '*', ["to-number", ["get", "id"]], 10]
]
```

### `2.断言:`

判断输入值是不是属于某种类型

```
//判断输入值value是一个数组
["array", value]: 返回array

//判断输入值value是一个布尔值
["boolean", value]: 返回boolean

//判断输入值value是一个数字
["number", value]: number

//判断输入值value是一个对象
["object", value]: object

//判断输入值value是一个字符串
["string", value]: string

//以上输入多个value，会按顺序比较，知道返回第一个满足的value，如果都不满足，返回false或者报错

//
```

1. collator 

返回一个collator，用于与语言环境相关的比较操作。在case-sensitive和diacritic-sensitive选项默认为false。该locale参数指定要使用的语言环境的IETF语言标记。如果未提供，则使用默认语言环境。如果请求的语言环境不可用，collator则将使用系统定义的后备语言环境。使用resolved-locale测试的现场备用行为的结果。

```
["collator",
    { "case-sensitive": boolean, "diacritic-sensitive": boolean, "locale": string }
]: collator
``` 

2. literal

提供文字数组或对象值。

```
["literal", [...] (JSON array literal)]: array<T, N>
["literal", {...} (JSON object literal)]: Object
```

3. format

返回formatted包含用于混合格式text-field条目的注释的文本。如果设置，则text-font参数将覆盖由根布局属性指定的字体。如果设置，则font-scale参数指定相对于text-size根布局属性中指定的比例因子。
```
["format",
    input_1: string, options_1: { "font-scale": number, "text-font": array<string> },
    ...,
    input_n: string, options_n: { "font-scale": number, "text-font": array<string> }
]: formatted
```

### `3.表达式类型转换`

1. 转布尔值boolean

 将输入值转换为布尔值。当输入是空字符串，0 ，false，null 或 NaN,结果是false. 否则是true。
```
["to-boolean", value]: boolean
```

2. 转为颜色color

将输入值转换为颜色。如果提供了多个值，则会依次评估每个值，直到获得第一个成功的转换为止。如果没有任何输入可以转换，则该表达式为错误。

```
["to-color", value, fallback: value, fallback: value, ...]: color
```

3. 转数字number

将输入值转换为数字。
* 如果输入为null或false，结果为0。
* 如果输入为true，结果为1。
* 如果输入为字符串，则将按照[ECMAScript中“字符串转Number规则”](https://tc39.es/ecma262/#sec-tonumber-applied-to-the-string-type)中指定的语言规范执行。
* 如果提供了多个值，则会依次评估每个值，直到获得第一个成功的转换为止。
* 如果没有任何输入可以转换，则该表达式为错误。

```
["to-number", value, fallback: value, fallback: value, ...]: number
```

4. 转字符串string

将输入值转换为字符串。
* 如果输入为null，则结果为""。
* 如果输入为布尔值，则结果为"true"或"false"。
* 如果输入是数字，则将其转换为[ECMAScript语言规范的“ NumberToString”](https://tc39.es/ecma262/#sec-tostring-applied-to-the-number-type)算法指定的字符串。
* 如果输入是彩色，它被转换为以下形式的串"rgba(r,g,b,a)"，其中r，g和b是数字范围从0到255，和a范围为0〜1。
* 其他，按照[JSON.stringifyECMAScript语言规范](https://tc39.es/ecma262/#sec-json.stringify)的功能执行。

```
["to-string", value]: string
```

4. 类型判断typeof

返回描述给定值类型的字符串。

```
["typeof", value]: string
```

### 特征数据 Feature data
1. accumulated

获取到目前为止累积的集群属性的值。只能在clusterProperties集群化GeoJSON源的选项中使用。 
```
["accumulated"]: value
```
2. feature-state

从当前要素的状态检索属性值。如果请求的属性不在功能状态上，则返回null。要素的状态不是GeoJSON或矢量切片数据的一部分，必须在每个要素上以编程方式设置。请注意，[“ feature-state”] 仅可与支持数据驱动样式的绘画属性一起使用。
```
["feature-state", string]: value
```

3. geometry-type

获取要素的几何类型：（点，多点，线串，多线串，多边形，多多边形）。
Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon.
```
["geometry-type"]: string
```
例如：
```
layout:{
    "text-field": ["geometry-type"]
}
//获取的值是 Point
```

4. id

获取功能的ID（如果有的话）。
```
["id"]: value
```

5. line-progress

沿渐变线获取进度。只能在line-gradient属性中使用。
```
["line-progress"]: number
```

6. properties

获取要素属性对象。请注意，在某些情况下，直接使用[“ get”，“ property_name”] 可能更有效。
例如获取的是properties的整个对象

```
["properties"]: object
```

### Lookup

1. at

从数组中检索一个项目。
number,在不在数组中
```
["at", number, array]: ItemType
```

2. get

从当前要素的feature's properties 中 或从 另一个对象（如果提供了第二个自变量）中检索属性值。如果缺少所请求的属性，则返回null。
```
["get", string]: value

["get", string, object]: value
```

3. has

测试当前要素feature's properties中是否存在某个属性值；如果提供了第二个参数，则从另一个对象中进行测试。

```
["has", string]: boolean
["has", string, object]: boolean
```

例如：

```
// 判断properties对象中是否有 id 属性，度过有返回true，否则返回false
filter:["has", 'id']
```

4.  length

获取数组或字符串的长度。

```
["length", string | array | value]: number
```

### 判断
本节中的表达式可用于将条件逻辑添加到样式中。例如，'case'表达式提供基本的“ if / then / else”逻辑，还有'match'允许您将输入表达式的特定值映射到不同的输出表达式。

1. `! 逻辑非`

逻辑否定。true如果输入为false，false则返回true。

```
["!", boolean]: boolean
```

2. `!= 不等于`

true如果输入值不相等，false则返回，否则返回。比较是严格类型化的：不同运行时类型的值始终被认为是不相等的。在解析时已知类型不同的情况将被视为无效，并会产生解析错误。接受一个可选collator参数来控制与语言环境有关的字符串比较。
```
["!=", value, value]: boolean
["!=", value, value, collator]: boolean
```

3. `< 小于`

如果第一个输入严格小于第二个输入，则返回true，否则返回false。参数必须是字符串或数字。如果在求值过程中不满足，则表达式求值会产生错误。已知此约束在解析时不成立的情况被认为是有效的，并且会产生解析错误。接受一个可选collator参数来控制与语言环境有关的字符串比较。

```
["<", value, value]: boolean
["<", value, value, collator]: boolean
```
4. `<= 小于等于(不大于)`

类似于上面的<逻辑，等于或者小于

```
["<=", value, value]: boolean
["<=", value, value, collator]: boolean
```

5. `== 等于比较`

比较是严格类型化的，不同运行时类型的值始终被认为是不相等的。

```
["==", value, value]: boolean
["==", value, value, collator]: boolean
```

6. `> 大于`

第一个参数是否大于第二个参数

```
[">", value, value]: boolean
[">", value, value, collator]: boolean
```

7. `>= 大于等于(不小于)`
```
[">=", value, value]: boolean
[">=", value, value, collator]: boolean
```

8. `all` 所有满足

是有参数是否都为true，如果是返回true，如果有一个不是，则返回false

```
["all", boolean, boolean]: boolean
["all", boolean, boolean, ...]: boolean
```

9. `any` 任一满足

是有参数只要有一个为true，如果是返回true，如果全部为false，则返回false

```
["any", boolean, boolean]: boolean
["any", boolean, boolean, ...]: boolean
```

10. `case` 条件
结果为第一个满足条件的输出吗，如果都不满足则为fallback。

```
["case",
    条件1: boolean, 输出: OutputType,
    条件2: boolean, 输出: OutputType,
    ...,
    fallback: OutputType
]: OutputType
```

例如：

```
"circle-color": [
    "case",
    ['has','ids'], 'red',
    ['has','id'], 'yellow',
    'blue'
],

// 条件返回值需要是一个boolean类型，相当于
"circle-color": [
    "case",
    true, 'red',
    false, 'yellow',
    'blue'
],

//以上语句的的意思是，满足为red,不满足为yellow，都不满足(默认)为blue

```

11. `coalesce` 合并

依次评估每个表达式，直到获得第一个非空值，然后返回该值。

["coalesce", OutputType, OutputType, ...]: OutputType

12. `match` 匹配

选择标签值与输入值匹配的输出，如果找不到匹配项，则选择回退值。输入可以是任何表达式（例如["get", "building_type"]）。每个标签label必须是：

* 单个文字值；要么
* 文字值数组，其值必须是所有字符串或所有数字（例如[100, 101]或["c", "b"]）。如果数组中的任何值匹配，则输入匹配，类似于不推荐使用的"in"运算符。

每个标签必须唯一。如果输入类型与标签类型不匹配，则结果将是后备值。

```
["match",
    input: InputType (number or string),
    label: InputType | [InputType, InputType, ...], output: OutputType,
    label: InputType | [InputType, InputType, ...], output: OutputType,
    ...,
    fallback: OutputType
]: OutputType
```

例如：
```
"circle-color": [
    'match', ['get', 'name'],
    '点1', 'red',
    '点2', 'yellow',
    ['点3','点4'], 'blue',
    '#fff'
],

//获取feature's properties 中的name值，根据name值匹配对应的颜色，默认是(没有匹配到）#fff , ['点3','点4'] 表示是label是可以是数组类型,
```

### Ramps, scales, curves 倾斜，比例，曲线

 1. interpolate 插

 通过在成对的输入和输出值（“stops”）之间进行插值, 产生连续，平滑的结果。input可以是任何number表达式（例如，["get", "population"]）。stop_input必须是严格按升序排列的数字文字。输出类型必须是`number`，`array<number>`，或`color`。

interpolation 类型：

* ["linear"]：在两个止动点之间线性地插值，该插值刚好小于输入并且大于输入。
* ["exponential", base]：在停靠点之间小于输入并大于输入的位置按指数进行插值。base控制输出增加的速率：较高的值可使输出向范围的高端增加更多。值接近1时，输出线性增加。
* ["cubic-bezier", x1, y1, x2, y2]：使用给定控制点定义的三次贝塞尔曲线进行插值。

```
["interpolate",
    interpolation: ["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2 ],
    input: number,
    stop_input_1: number, stop_output_1: OutputType,
    stop_input_n: number, stop_output_n: OutputType, ...
]: OutputType (number, array<number>, or Color)
```

例如：

```
"line-opacity": [
    "interpolate", ["linear"], ["zoom"],
    9, 0.8,
    15, 0.5
]

//当zoom 为9的时候，透明度是0.8，当zoom为15的时候，透明度为0.5
```

2. interpolate-hcl

同上，区别是返回的必须是hcl color颜色，

```
["interpolate-hcl",
    interpolation: ["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2 ],
    input: number,
    stop_input_1: number, stop_output_1: Color,
    stop_input_n: number, stop_output_n: Color, ...
]: Color
```

3. interpolate-lab

同上，区别是返回的必须是lab color颜色，

["interpolate-lab",
    interpolation: ["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2 ],
    input: number,
    stop_input_1: number, stop_output_1: Color,
    stop_input_n: number, stop_output_n: Color, ...
]: Color

2. step 

相当于，获取input的值的结果，若在某个范围内，就给一个结果。

通过评估由成对的输入和输出值（“停止”）定义的分段常数函数，可以产生离散的步进结果。
* input可以是任何number数值表达式（例如，["get", "radius"]）。
* stop_input必须是严格按升序排列的number。stop_output为输出值；
* 如果输入小于第一个止损，则返回第一个输入值stop_output_0。

```
["step",
    input: number,
    stop_output_0: OutputType,
    stop_input_1: number, stop_output_1: OutputType,
    stop_input_n: number, stop_output_n: OutputType, ...
]: OutputType

```

例如
```
"circle-color": [
    //根据feature's properties中的radius值，
    'step', ['get', 'radius'],
    //radius值小于3的显示#fff
    '#fff',
    //3-4 显示red
    3, 'red',
    //5-6显示yellow
    5, 'yellow',
    //7以上显示blue
    7, 'blue',
],
```

###  变量绑定

1. let 

将表达式绑定到命名变量，然后可以使用[“ var”，“ variable_name”] 在结果表达式中进行引用。

```
["let",
    string (alphanumeric literal), any, string (alphanumeric literal), any, ...,
    OutputType
]: OutputType
```

2. var
引用变量绑定使用“ let”。

```
["var", previously bound variable name]: the type of the bound expression
```


### 字符串操作

1. concat 字符串连接


返回string，连接各个输入值。每个输入都将转换为字符串，就像通过to-string。

```
["concat", value, value, ...]: string
```

例如：

```
"text-field": ['concat' ,'aaa', 'bbb']

结果： aaabbb
```

2. downcase 转小写

```
["downcase", string]: string
```

3. upcase 转大写

返回转换为大写的输入字符串。遵循Unicode默认大小写转换算法和Unicode字符数据库中不区分语言环境的大小写映射。

```
["upcase", string]: string
```

4. `is-supported-script 支持脚本`

返回true是否期望输入字符串清晰呈现。返回false如果输入字符串包含无法呈现而不会失去意义的部分（例如，要求复杂文本整形的印度脚本，或者如果mapbox-gl-rtl-textMapbox GL JS中未使用该插件，则为从右到左脚本）。

```
["is-supported-script", string]: boolean
```

5. `resolved-locale`

返回提供的所使用语言环境的IETF语言标记collator。这可用于确定默认系统区域设置，或确定是否成功加载了请求的区域设置。

```
["resolved-locale", collator]: string
```

### 颜色表达式

1. rgb 

从红色，绿色和蓝色分量创建颜色值，该值必须在0到255之间，并且alpha分量为1。如果任何分量超出范围，则该表达式为错误。

```
["rgb", number, number, number]: color
```

2. rgba

从必须在0到255之间的红色，绿色，蓝色分量和必须在0到1之间的alpha分量创建颜色值。如果任何分量超出范围，则表达式为错误。

```
["rgba", number, number, number, number]: color
```

3. to-rgba

返回一个四元素的数组，该数组包含输入颜色的红色，绿色，蓝色和Alpha分量的顺序。

```
["to-rgba", color]: array<number, 4>

```

### Math 表达式

1.  `- 减法`

对于两个输入，返回从第一个输入减去第二个输入的结果。对于单个输入，返回从0减去它的结果。

```
["-", number, number]: number
["-", number]: number
```

2. `* 乘法`

返回输入的乘积。

```
["*", number, number, ...]: number
```

3.  `/ 除法`

返回第一个输入与第二个输入的浮点除法的结果。

```
["/", number, number]: number
```

4. `% 取余`

返回第一个输入除以第二个输入的整数后的余数。

```
["%", number, number]: number
```

5. `^ 幂`

返回将第一个输入提高到第二个指定的幂的结果。

```
["^", number, number]: number
```

6. `+ 加法`

返回输入的总和。

```
["+", number, number, ...]: number
```

7. `abs 绝对值`

返回输入的绝对值。

```
["abs", number]: number
```

8. `三角函数`

```
// 1. 返回输入的反余弦值。
["acos", number]: number

// 2. 返回输入的反正弦值。
["asin", number]: number

// 3. 返回输入的反正切。
["atan", number]: number

// 4. 返回输入的余弦值。
["cos", number]: number

// 5. 返回输入的正弦值。
["sin", number]: number

// 6. 返回输入的切线。
["tan", number]: number
```

9. `四舍五入取整相关`

```
// 1. 向上取整，返回大于或等于输入的最小整数。
["ceil", number]: number

// 2. 返回小于或等于输入的最大整数。
["floor", number]: number

// 3. 四舍五入 将输入舍入到最接近的整数。中途值从零舍入。例如，["round", -1.5]计算结果为-2。
["round", number]: number
```

10. `常数类`

```
// 1. 返回数学常数e。
["e"]: number

// 2. 返回输入的自然对数。
["ln", number]: number

// 3. 返回数学常数ln（2）。
["ln2"]: number

// 4. 返回输入的以十为底的对数。
["log10", number]: number

// 5. 返回输入的以2为底的对数。
["log2", number]: number

// 6. 返回数学常数pi。
["pi"]: number

```

11. max 取最大值

返回输入的最大值。

```
["max", number, number, ...]: number
```

12. min 取最小值

返回输入的最小值。

```
["min", number, number, ...]: number
```

13. sqrt 返回输入的平方根。

```
["sqrt", number]: number
```


### Zoom 缩放

获取当前的缩放级别。请注意，在样式布局和绘画属性中，[“ zoom”] 可能仅作为顶级“ step”或“ interpolate”表达式的输入出现。

```
["zoom"]: number
```


### Heatmap 热力图

1. heatmap-density

获取热图图层中像素的内核密度估计，这是在特定像素周围拥挤多少数据点的相对度量。只能在heatmap-color属性中使用。

```
["heatmap-density"]: number
```

### 其他方法

可以将任何layout或paint属性的值指定为一个函数。使用功能可以使地图要素的外观随当前缩放级别zoom和/或地图项的feature's properties 变化而变化。默认输入值是zoom


1. stops

必须是一个数组，根据输入和输出值定义功能。一组一个输入值和一个输出值称为stop”。停止输出值必须是文字值（即不是函数或表达式），并且适用于该属性。例如，fill-color属性中使用的stops函数输出值必须为colors。

例如：

```
"circle-radius": {
    "stops": [
        // zoom 为1时，半径为2
        [1, 2],
        //zoom为10时，半径为20
        [10, 20]
    ]
}


// [10, 20]  就是一个stop， 10是输入值， 20是输出值，多个stop就是一个stops

```

2. property

是一个字符串，表示属性名。
如果指定，该函数将采用指定的要素属性作为输入。


```
 "circle-radius": {
    "property": "radius",
    "stops": [
        // radius 为1时，半径为2
        [1, 2],
        // radius 为5时，半径为 20
        [5, 20],
        // radius 为10时，半径为5
        [10, 5]
    ]
}

// 此时的 1 5 10 就是radius 的取值步长，在1-5的范围内，取值是2-20，

```

3. base
类型是number，默认是1。
插值曲线的指数基础。它控制函数输出的增加速率。较高的值会使输出向该范围的高端增加更多。值接近1时，输出线性增加. 调节线性


```
 "circle-radius": {
    "base": 1.3,
    "stops": [
        // radius 为1时，半径为2
        [1, 2],
        // radius 为5时，半径为 20
        [10, 20],
    ]
}

// base为1时，是正常显示，小于1，如0.8时候，差距会变小，大于1时，差距会拉大，大的更大，小的更小。

```


4. type

可选值："identity", "exponential","interval", or "categorical"

* identity：返回其输入作为输出的函数。
* exponential：通过在停靠点之间进行插值而生成输出的函数，该停靠点小于且大于函数输入。域（输入值）必须是数字，并且style属性必须支持插值。支持插值的样式属性用标记为“指数”符号，并且指数是这些属性的默认函数类型。
* interval： 返回停止点输出值刚好小于函数输入的函数。域（输入值）必须是数字。任何样式属性都可以使用间隔函数。对于标有，“间隔”符号的属性，这是默认功能类型。
*categorical： 一个函数，其返回的停止值等于函数输入的输出值。

5. default

如果没有其他可用值，则该值将用作备用功能。在以下情况下使用它：
* 在分类函数中，当要素值与任何 stops值都不匹配时。
* 在特性和缩放特性函数中，当要素不包含指定特性的值时。
* 在标识函数中，当 feature值对于样式属性无效时（例如，如果函数用于 circle-color属性，但特征属性值不是字符串或无效颜色）。
* 在间隔或指数属性以及缩放和特性函数中，当特征值不是数字时。
如果未提供默认值，则在这些情况下使用style属性的默认值。

6. colorSpace

可选值："rgb", "lab", "hcl"。

插值颜色的颜色空间。与RGB空间中插值的颜色相比，在LAB和HCL等感知颜色空间中插值的颜色趋向于生成看起来更一致的色带，并产生易于区分的颜色。
* "rgb"： 使用RGB颜色空间内插颜色值
* "lab"：使用LAB颜色空间对颜色值进行插值。
* "hcl"： 使用HCL颜色空间内插颜色值，分别内插Hue，Chroma和Luminance通道。

7. Zoom-and-property functions

允许地图要素的外观随其属性和缩放而改变。每个止挡是一个包含两个元素的数组，第一个是具有属性输入值和缩放的对象，第二个是函数输出值。请注意，对属性功能的支持尚未完成。

```
{
    "circle-radius": {
        "property": "rating",
        "stops": [
            // zoom is 0 and "rating" is 0 -> circle radius will be 0px
            [{zoom: 0, value: 0}, 0],

            // zoom is 0 and "rating" is 5 -> circle radius will be 5px
            [{zoom: 0, value: 5}, 5],

            // zoom is 20 and "rating" is 0 -> circle radius will be 0px
            [{zoom: 20, value: 0}, 0],

            // zoom is 20 and "rating" is 5 -> circle radius will be 20px
            [{zoom: 20, value: 5}, 20]
        ]
    }
}
```

### 一些给filter用的表达式，虽然没有废除，但是建议使用表达式

```
{
    paint:{
        ...
    }   
    filter: ['in','radius',5]
}

```

1. 是否存在属性

```
["has", key] feature[key] 存在
["!has", key] feature[key] 不存在
```

2. 比较过滤器

```
["==", key, value] 相等: feature[key] = value
["!=", key, value] 不相等: feature[key] ≠ value
[">", key, value] 大于: feature[key] > value
[">=", key, value] 大于或等于: feature[key] ≥ value
["<", key, value] 小于: feature[key] < value
["<=", key, value] 小于或等于: feature[key] ≤ value
```

3. in 

```
["in", key, v0, ..., vn] 集合包含：feature [key] ∈ { v0，...，vn }
["!in", key, v0, ..., vn] 设置排除：feature [key] ∉ { v0，...，vn }
```


4. 组合过滤器

["all", f0, ..., fn] 逻辑AND：F0 ∧...∧ FN
["any", f0, ..., fn] 逻辑OR：F0 ∨...∨ FN
["none", f0, ..., fn] 逻辑NOR：¬ F0 ∧...∧¬ FN


以上四类中的：

key 必须是 feature property属性或者以下特殊值：
* "$type"：feature 类型，他可以和 "==","!=", "in", and "!in" 一起使用. 结果可能是"Point", "LineString", 或 "Polygon".
* "$id"：功能标识符。此键可以与"=="，"!="，"has"，"!has"，"in"，和"!in"一起使用。

```
{
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
            "id": "1",
            "name":"点1",
            "desc":"这是点1",
            "radius": 1
        },
        "id":54, //$id 就是这里
        "geometry": {
          "type": "Point",  //$type 就是他
          "coordinates": [
            108.9902114868164,
            34.24813554589752
          ]
        }
      }
    ]
}    
```

value 值必须是必须是一个字符串string，数字number或布尔值boolean进行比较的属性值。


表达式参考

## 一、数学运算符

## 二、逻辑运算符

## 三、字符串运算符

## 四、数据运算符
数据表达式是用来访问数据的，例如： ['get','name'],就是获取数据中的name值

## 五、Camera operators 表达式

相机类表达式，可以根据地图 zoom 的值变化而变化。

例如：
```
{
    "circle-radius": [
        "interpolate", ["linear"], ["zoom"],
        // zoom 是5或者更小 -> 圆半径是1px
        5, 1,
        // zoom 是10或者更大 -> 圆半径是5px
        10, 5
    ]
}
```