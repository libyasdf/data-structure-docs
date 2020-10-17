---
order: 1
title: js历史与简介
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


## BOM
浏览器对象模型

# JavaScript 版本