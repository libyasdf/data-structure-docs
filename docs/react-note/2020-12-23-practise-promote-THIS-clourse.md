---
order: 15
title: 习题
group:
    title: 变量提升 THIS closure 默认值导致bug
    order: 1
---

# 习题

(/2020年08期在线JS高级/作业/01.闭包作用域作业.html)
  
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

## 闭包作用域

[20201211](1.png)  

### arguments

arguments是类数组集合，开辟一个heap，有实参就会创建，与形参无关。

* JS非严格模式下(严格模式下没有这个机制)：初始化arguments -> 形参赋值：
  + 形参赋值完成后(**只**在这个阶段)
  + 把arguments类数组集合中的每一项与形参变量每一项建立起映射机制(一个修改，另外一个也会跟着修改)

```
"use strict";
var a = 4;
function b(x, y, a) {
    console.log(a);
    arguments[2] = 10;// 映射机制
    console.log(a);
}
a = b(1, 2, 3);
console.log(a);
```

非严格模式下：3、10、undefined
严格模式下：3、3、undefined

```
function fn(x, y) {
    /!*
     * EC(FN)
     *   作用域链:<EC(FN),EC(G)>
     *   初始ARGUMENTS: {0:10,length:1} 
     *   形参赋值:x=10 y=undefined
     *      「映射关系」  x->arguments[0]
     *   变量提升:--
     *!/
    let arg = arguments;
    x = 100;
    console.log(arg[0]); //=>100

    arg[1] = 200;// 映射已经结束 修改arguments也不会同步到形参上
    console.log(y); //=>undefined
}

fn(10); 
```
### 匿名函数

```
/!*
 * EC(G)
 *   var test;  -> 0x0001
 *!/
var test = (function (i) {
    /!* 
     * EC(AN)
     *   作用域链:<EC(AN),EC(G)>
     *   形参赋值:i=2  ->4
     *   变量提升:--
     *!/
    return function () {
        /!*
         * EC(TEST)
         *   作用域链:<EC(TEST),EC(AN)> 
         *   初始ARG:{0:5,length:1}
         *   形参赋值:--
         *   变量提升:--
         *!/
        alert(i *= 2); //=>i=i*2  "4"
    }; //=>return 0x0001;  [[scope]]:EC(AN)
})(2);
test(5);
```

[20201211](2.png)  

在执行FUNC1时，重构了FUNC，开辟了小函数heap，所以导致第一次执行FUNC形成的上下文无法被释放，形成闭包。

[20201108](1.js/png)  

>去第七期里找图

区分：  
* xxx()函数执行(上下文中的某个变量:存储的值函数)去执行
* 对象xxx()成员访问

```
function fun(n, o) {
    console.log(o);
    return {
        fun: function (m) {
            return fun(m, n);
        }
    };
}
var c = fun(0).fun(1);
c.fun(2);
c.fun(3);
```

## 匿名函数“具名化”（建议/标准这么去做）

比如：

+ 自执行函数
+ 函数表达式 
  + const fn = function fn(){};
  + document.body.onclick = function bodyClick(){};
  + Array.prototype.unique = function unique(){};
+ 回调函数

```
"use strict";// 
(function (x) {
    // ...
    // 在JS严格模式下不支持，以下的代码
    console.log(arguments.callee); // 代表函数本身「只能在函数内部使用」
    console.log(arguments.callee.caller); // 函数执行所在的上下文对应的函数
})(10);
```

```
function fn() {
    console.log(arguments.callee.caller); //=>b函数「就是在自己上下文中执行的，返回null」
}
function b() {
    fn();
}
b();
```

* 匿名函数具名化和实名函数不是一个概念「具名化的名字不能再函数以外使用」 

```
(function fn(x) {
    console.log(fn); //函数本身，这样就可以在函数内部使用了
    fn();// 可递归，也导致栈溢出
})(10);
// 具名化的名字不能再函数以外使用
console.log(fn); //=>Uncaught ReferenceError: fn is not defined 
```

* 匿名函数具名化的值，是不允许修改的

```
(function fn(x) {
    fn = 10; // 并且值是不允许修改的
    console.log(fn); //函数
})(10);
```

但是

* **具名化的优先级低**，如果这个名字有被当前上下文重新声明过，则以重新声明的为准

```
(function fn(x) {
    let fn = 10; // 如果这个名字有被当前上下文重新声明过，则以重新声明的为准
    console.log(fn); //=>10
})(10);
或者：
(function fn(fn) {
    fn = 10; // 形参也相当于重新声明
    console.log(fn); //=>10
})(10);
```

## 实现函数fn，让其具有如下功能（百度二面）

[20201211](2.js)  

```
let res = fn(1,2)(3);
console.log(res); //=>6  1+2+3
```

 * ...params ES6剩余运算符「获取的结果是一个数组」
 * arguments 获取的结果是一个类数组 
 
```
const fn = function fn(...params) {
    return function anonymous(...args) {
        // 合并两次传递的参数 && 求和(题目要求)
        params = params.concat(args);

        // 数组求和
        /!* 
        // 方案一：命令式编程 ～HOW 在乎的是过程「允许我们把控过程中每一步细节  弊端：繁琐&代码多」
        let total = 0;
        for (let i = 0; i < params.length; i++) {
            total += params[i];
        }
        return total; 
        *!/

        /!*
        // 方案二：函数式编程「推荐」 WHAT 不重视过程，只在乎结果
        //把具体如何实现封装成为一个函数，想要实现某些需求，直接执行函数即可，对于用户来讲，函数内部如何处理不需要去管，只需要能拿到结果即可  
        // 优势:简单&减少冗余代码  
        // 弊端:只能按照既定的函数内部规则来执行，无法自己管控过程的细节
        let total = 0;
        params.forEach(item => {
            total += item;
        });
        return total;
        *!/

        /!* return params.reduce((result, item) => {
            return result + item;
        }); *!/
        return params.reduce((result, item) => result + item);

        // 方案三：投机取巧 -_-
        // return eval(params.join('+'));
    };
};
```

简化：

```
const fn = (...params) => (...args) => params.concat(args).reduce((result, item) => result + item);
let res = fn(1, 2)(3);
console.log(res); //=>6 
```
## reduce 

* reduce也是用来实现数组的迭代的方法「可以实现每一次处理结果的累计」
  + arr.reduce([callback]) 依次迭代数组中的每一项，每迭代一次都把[callback]执行一次，并且传递三个值
  + result 上一次回调函数执行的返回结果「如果是第一次执行，获取的是数组的第一项」
  + item 依次遍历的数组每一项「从第二项开始遍历」
  + index 遍历的当前项索引
*  把最后一次回调函数执行的返回值作为reduce的 _总结果_

arr.reduce([callback],[initial])
+ result初始值是[initial]  数组从第一项开始迭代

```
let arr = [10, 20, 30];
let total = arr.reduce((result, item, index) => {
    console.log(result, item, index);
    // 1) 10 20 1  =>30
    // 2) 30 30 2  =>60
    return result + item;
});
```

### reduce实现

```
Array.prototype.reduce = function reduce(callback, initial) {
    // this->arr THIS一般是数组的实例(数组)
    if (typeof callback !== "function") throw new TypeError('callback must be a function!');
    let self = this,
        i = 0,
        len = self.length;
    if (typeof initial === "undefined") {
        initial = self[0];
        i = 1;// 是否有初始值，决定了迭代的次数
    }
    // 迭代数组每一项   
    for (; i < len; i++) {
        let item = self[i];
        initial = callback(initial, item, i);
    }
    return initial;
};

// reduceRight实现
Array.prototype.reduceRight = function reduceRight(callback, initial) {
    let self = this;
    self = self.reverse();
    return self.reduce(callback, initial);
};
```

```
let arr = [10, 20, 30];
let total = arr.reduce((result, item, index) => {
    return result + item;
}, 100);
console.log(total);
```
## THIS

[20201106](1.js)  

* EC（AN） 作用域筵:<EC(AN),EC(G)>
  + 初始THIS :window 非严格模式（严格模式下undefined）
  + 形参赋值:num=20
  + 变量提升:--

```
var num = 10;
var obj = {
    num: 20
};
obj.fn = (function (num) {
    // EC（AN）闭包
    this.num = num * 3;
    num++;// 私有变量num = 20 => 21（区分作用域链上的this 与 私有变量）
    return function (n) {
        this.num += n;
        num++;
        console.log(num);
    };// obj. fn = 0x001; [ [scope]] :EC (AN)
})(obj.num);
var fn = obj.fn;// fn = 0x001
fn(5);
obj.fn(10);
console.log(num, obj.num);
```
* 函数中的THIS是谁，和函数在哪定义的以及在哪执行的都没有关系，按照总结的规律去分析执行主体即可。

* this只看最后一个「.」不往上找

```
(function () {
    var val = 1;
    var json = {
        val: 10,
        dbl: function () {
            val *= 2;
        }
    };
    json.dbl();
    alert(json.val + val);
})();
```
* 区分this.val 与直接val 的查找问题（`val *= 2`不带this的val是变量，json下的对象的属性）

# 调试技巧

debugger;

chrome sources 中 右侧 Scope里面Block(块级上下文) 与 Global(window)

看作用域`dir(b)`里面的`[[scope]]`
