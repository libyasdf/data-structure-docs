---
order: 19
title: 面向对象基础知识
group:
    title: new函数的处理过程 
    order: 1
---

# JS内置类 
    + Number  String  Boolean  Symbol  BigInt
    + Object
       + Object
       + Array
       + NodeList、HTMLCollection...
       + RegExp
       + Date
       + Set
       + Map
       + ...
    + Function 
  
[20201216/inde.html]  

`dir(box)`每一个HTML元素对象都有一个自己所属的类：
divDOM对象（实例） ->  HTMLDivElement  ->  HTMLElement  ->  Element -> Node -> EventTarget -> Object

* 操作一个DOM对象，就是操作某一个内置类的实例。

# 自定义类

* 自己搞点类，和创建他的实例

```javascript
function Fn(x, y) {
    let total = x + y;
    this.x = x;
    this.y = y;
    return total;
}

let total = Fn(10, 20);
let f = new Fn(10, 20);
```
[20201216/1.png]  

* Fn：类「构造函数」 -> **所有的类**都是 _函数数据类型_ 的（包含内置类）
 + 内置类：Number/String/Boolean/Symbol/BigInt/Object/Array/RegExp/Function
 ```javascript
 console.log(typeof Object); //=>"function"
 console.log(typeof Array); //=>"function"
 ```

* f:实例对象 -> **所有的实例**都是 _对象类型_ 的
  + 但是JS中有特殊性」
    ```javascript
    function sum(){}  -> Function实例  ->  typeof sum==="function"
    let arr=[]  -> Array实例  -> 首先是一个数组，其次才是对象
    ```

* JS中创建值(实例)有两种方案：
  + 字面量方案  
    `let n = 1`
  + 构造函数方案  
    `let n = new Number(10)`
* 对于对象和函数类型来讲，两种方案除了语法上的区别，没有啥特别的不同
* 但是对于原始值类型，区别还是很大的。
  + 字面量方式，返回的是原始值类型
  + 构造函数方式，返回的都是对象类型，但，**都是所属类的实例**

 ```javascript
 let n = 10; //原始值
let m = new Number(10); //对象
console.log(m.toFixed(2)); //->'10.00'
// 默认隐式转换
console.log(n.toFixed(2)); //->'10.00'  浏览器默认会把“n”转换为“new Number(n)”对象类型的实例
// 所以也能调用方法
console.log(n - 10); //->0
console.log(m - 10); //->0  浏览器会默认把对象转换为数字「Symbol.toPrimitive -> valueOf -> toString -> Number」 
// m[Symbol.toPrimitive] undefined
// m['valueOf'] f
// m['valueOf']() 10
// toString
 ```
# 特殊：Symbol / BigInt 是不允许被new

`let sy1 = Symbol(AA)`  

* Uncaught TypeError: Symbol/BigInt is not a constructor 不是构造函数不允许被new
* 想获取Symbol对应的对象类型值  (靠的是)=> Object([value])获取当前[value]对应的对象类型值

`Object(sy1)`里面放任何值，都能变成对应的对象类型。

# new函数的处理过程

