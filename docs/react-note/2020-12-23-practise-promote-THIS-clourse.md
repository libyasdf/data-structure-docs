---
order: 15
title: 习题
group:
    title: JS
    order: 1
---

# 习题

(file:///Users/baiyueli/Desktop/2020年08期在线JS高级/作业/01.闭包作用域作业.html)
  
## 变量提升

[20201209](1.js)  

* 函数执行形成私有上下文
* 形参赋值（私有）
* 变量提升


+ ||逻辑或  A||B  首先隐式把A转换为布尔看真假，如果A是真，返回A的值，否则返回B的值
+ &&逻辑与  A&&B  如果A是真，返回B的值，否则返回A的值
+ 同时出现，&&优先级要高于||

* `function fn(x=0){}`  ES6形参赋值默认值「这就是一个坑」

```
function fn(x, callback) {
    // x如果不传递，默认值为0
    if (typeof x === "undefined") {
        x = 0;
    }
    x = x || 0; // 不严谨，它是x只要是假，不一定是没传「但是可以这样玩」

    typeof callback === "function" ? callback() : null;// 最好的做法
    callback && callback();// 不好的做法
}

fn(10, function(){});
```

[20201209](2.js)  

```
{
    function foo() {}
    foo = 1;// 私有
}
console.log(foo);
```

* 为了**兼容**新老规范：
  + 出现在{...} (除函数和对象等)中的function， 只声明不定义  
  + {...}中出现let/ const/function则会产生一个块级上下文「ES6」

* 原本变量提升已经处理过了，应该不管了，但是:由于这行代码被EC(G)和EC(B)都庞幸过
  所以:浏览器会把当前上下文中，这行代码之前对foo的所有操作，也都同步给全局，上下文中的foo一份，但是之后对foo的操作都认为是私有的。

[分析图：20201209](1.png)  

```
debugger;
/!*
 * EC(G)
 *    function foo; 「2」
 *    function foo; 「4」   
 * 
 *    同步=>0x0002  1
 *!/
// console.log(foo); =>undefined
{
    /!*
     * function的声明和定义，在最一开始做完了，所以，后面遇到的时候，只是去做同步的事情。
     * EC(B)
     *   foo = 0x0001; 「2」   [[scope]]:EC(B)
     *   foo = 0x0002; 「4」 
     *!/

    // console.log(foo); =>0x0002 函数
    function foo() {1} //特殊：把之前对foo的操作同步给全局一份(只做这一个操作)
    foo = 1; //私有foo=1
    // console.log(foo); =>1
    function foo() {2} //特殊：把之前对foo的操作同步给全局一份(只做这一个操作)
    // console.log(foo); =>1
}
console.log(foo); //=>1 
```

* **仅在这种情境下**，遇到function，就去同步代码到全局

[20201209](3.js)  

ECM9.2.12

### ES6新规则
**导致了两个上下文，注意bug**

 *  前提：
 *    1. 函数有形参赋值默认值，不论是否生效(也就是传递值后不走默认值)都遵循如下的规律
 *    2. 函数体中有声明变量「基于let/const/var」，注意：let/const声明的变量是不允许重复的（不能和形参一致） 

 *  规则：
 *    函数执行会产生一个私有的执行上下文「作用域链->this->arguments->形参赋值」
 *    它会把函数体中的代码，单独作为一个私有的“块级”上下文，并且其上级上下文是函数的那个私有的上下文。

 * 小知识点：如果函数私有上下文中的某变量和块级上下文中的某变量一致，则块级上下文的最开始时候，会把函数上下文中的值同步给块级上下文中同名变量一份
 
 ```
debugger;
var x = 1;
function func(x, y = function anonymous1(){x = 2}){// 前提 1
    var x = 3;// 前提 2
    y();
    console.log(x);
};
func(5);
console.log(x); 
```
 [20201209](2.png)  

* 块级上下文 没有this 没有形参赋值 没有arguments
* this、形参赋值、arguments函数里面都有

# 调试技巧

debugger;

chrome sources 中 右侧 Scope里面Block(块级上下文) 与 Global(window)
