---
order: 21
title: 函数的多种角色
group:
    title: 
    order: 1
---

# 在内置类的原原型上扩展方法

```javascript
let arr = [10, 20];
console.log(arr.slice(1).map(item => item * 10).push('X').toFixed(2).split('.'));

  + 调用起来方便，可以直接基于实例去调用方法，方法中的this就是实例「也就是我们要操作的值」
  + 可以实现链式调用
  + 自己扩展的方法最好设置前缀“myXxx”，防止自己扩展的方法覆盖原始内置的方法
```

```javascript
const checkVal = val => {
    val = +val;
    return isNaN(val) ? 0 : val;
};
Number.prototype.plus = function plus(val) {
    // this -> n 「对象，严格模式下可以是原始值」
    val = checkVal(val);
    return this + val;
};
Number.prototype.minus = function minus(val) {
    val = checkVal(val);
    return this - val;
};

let n = 10;
let m = n.plus(10).minus(5);
console.log(m); //=>15（10+10-5） 
```

# 函数的三种角色

+ 函数
    + 普通函数「闭包作用域」
    + 构造函数「类、实例」
    + 生成器函数
+ 对象

[20201220/1.png/2.js](原型链上方法的查找方式)  

* Array.prototype是Array对象，`Array.isArray(Array.prototype)`为true
* 写在原型上:供实例调用的「偏业务」
* 当做对象，设置的静态私有属性:工具类方法一般都写在这「偏功能」

* Function.prototype是函数，但是没有返回值

* 没有prototype（不能被new）：
  + 尖头函数
  + ES6快速赋值的函数QS？函数
  +  
  + Function.prototype「匿名空函数」

* Function自己是自己的实例，`Function.prototype === Function.__proto__`，`Function instanceof Function`都是 true

* 原型链上的去查找一个方法的时候，是顺着`__proto__`查找的。
![prototype chain](./img/20201220-1.jpg)  

[20201220/2.png/2.js](原型链上方法的查找方式)   

```javascript
function Foo() {
    getName = function () {
        console.log(1);
    };
    return this;
}
Foo.getName = function () {
    console.log(2);
};
Foo.prototype.getName = function () {
    console.log(3);
};
var getName = function () {
    console.log(4);
};
function getName() {
    console.log(5);
}
Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();
```

* 创建函数的实例，没用到也会把函数执行。
* 构造函数中，只有this.xxx = xxx才会和实例有关系。
* `new Foo`没有()，优先级19；`new Foo()`优先级20。

# NOTE:

* this所代表的值一定是对象  

