---
order: 1
title: 第一章 js历史与简介
group:
    title: 红宝书
    order: 1
---

# JavaScript 实现
js包含三部分：

## ECMAScript
核心
>ECMAScript，事实上，这门语言没有输入和输出之类的方法。ECMA-262 将这门语言作为一个基准来定义，以便在它之上再构建更稳健的脚本语言。
Web 浏览器只是 ECMAScript 实现可能存在的一种宿主环境（host environment）。宿主环境提供ECMAScript 的**基准实现**和与**环境自身交互**必需的扩展。  
扩展（比如 DOM）使用 ECMAScript 核心类型和语法，提供特定于环境的额外功能。

抛开浏览器，ECMA-262 到底定义了什么————在基本的层面，它描述这门语言的如下部分：  

* 语法
* 类型
* 语句
* 关键字
* 保留字
* 操作符
* 全局对象

*ps:* ECMAScript 只是对实现这个规范描述的所有方面的一门语言的称呼。JavaScript 实现了
ECMAScript，而 Adobe ActionScript 同样也实现了 ECMAScript。

***红宝书29页：历届ES标准添加的特性、ES符合型***  

***红宝书30页：浏览器支持标准***

## DOM
文档对象模型

>文档对象模型（DOM，Document Object Model）是一个应用编程接口（API），用于在 HTML 中使用扩展的 XML。  
DOM 将整个页面抽象为一组分层节点。HTML 或 XML 页面的每个组成部分都是一种节点，包含不同的数据。  
代码通过 DOM 可以表示为一组分层节点

（对于浏览器）DOM 就是使用 ECMAScript 实现的，但DOM 并非只能通过 JavaScript 访问。  

* DOM 视图：描述追踪文档不同视图（如应用 CSS 样式前后的文档）的接口。
* DOM 事件：描述事件及事件处理的接口。
* DOM 样式：描述处理元素 CSS 样式的接口。
* DOM 遍历和范围：描述遍历和操作 DOM 树的接口。  

>W3C 不再按照 Level 来维护 DOM 了，而是作为 DOM Living Standard 来维护，其快照称为
DOM4。DOM4 新增的内容包括替代 Mutation Events 的 Mutation Observers。

### 其他 DOM 
除了 DOM Core 和 DOM HTML 接口，有些其他语言也发布了自己的 DOM 标准。下面列出的语言是基于 XML 的，每一种都增加了该语言独有的 DOM 方法和接口：
*  可伸缩矢量图（SVG，Scalable Vector Graphics） 
*  数学标记语言（MathML，Mathematical Markup Language） 
*  同步多媒体集成语言（SMIL，Synchronized Multimedia Integration Language）

此外，还有一些语言开发了自己的 DOM 实现，比如 Mozilla 的 XML 用户界面语言（XUL，XML User Interface Language）
## BOM
浏览器对象模型（BOM） API ————用于支持访问和操作浏览器的窗
口

>而 BOM 真正独一无二的地方，当然也是问题最多的地方，就是它是唯一一个没有相关标准的 JavaScript 实现。**HTML5 改变了这个局面**，这个版本的 HTML 以正式规范的形式涵盖了尽可能多的 BOM 特性。由于 HTML5 的出现，之前很多与 BOM有关的问题都迎刃而解了

BOM 主要针对浏览器窗口和子窗口（frame），不过人们通常会把任何特定于浏览器的
扩展都归在 BOM 的范畴内。比如，下面就是这样一些扩展：

*  弹出新浏览器窗口的能力；
*  移动、缩放和关闭浏览器窗口的能力；
*  navigator 对象，提供关于浏览器的详尽信息；
*  location 对象，提供浏览器加载页面的详尽信息；
*  screen 对象，提供关于用户屏幕分辨率的详尽信息；
*  performance 对象，提供浏览器内存占用、导航行为和时间统计的详尽信息；
*  对 cookie 的支持；
*  其他自定义对象，如 XMLHttpRequest 和 IE 的 ActiveXObject。

因为在很长时间内都没有标准，所以每个浏览器实现的都是自己的 BOM。有一些所谓的事实标准，
比如对于 window 对象和 navigator 对象，每个浏览器都会给它们定义自己的属性和方法。现在有了HTML5，BOM 的实现细节应该会日趋一致。关



## JavaScript 版本

JavaScript 是一门用来与网页交互的脚本语言，包含以下三个组成部分。
*  ECMAScript：由 ECMA-262 定义并提供核心功能。
*  文档对象模型（DOM）：提供与网页内容交互的方法和接口。
*  浏览器对象模型（BOM）：提供与浏览器交互的方法和接口