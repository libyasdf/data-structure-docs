---
order: 20
title: 重写hasPubProperty方法 
group:
    title: 
    order: 1
---

# 重写hasPubProperty方法

```javascript
// hasOwnProperty、toString...
Object.prototype.xx = 'xx';

let obj = {
    name: 'zhufeng',
    age: 12,
    3: 200,
    0: 100,
    [Symbol('AA')]: function () {}
};
```

+ 优先遍历数字属性，而且按照从小到大遍历；数字属性遍历完，再去遍历其他的；
+ 无法遍历Symbol的私有属性
+ 遍历所属类原型上自定义的属性和方法「遍历了公有的：内置的是不可枚举的、自定义的属性是可枚举的」

```javascript
for (let key in obj) {
    if (!obj.hasOwnProperty(key)) break; //解决问题三 
    console.log(key, obj[key]);
} 
```

* 获取私有的属性：`Object.keys(obj) OR Object.getOwnPropertyNames(obj)`：返回包含所有非symbol私有属性的数组.
* `Object.getOwnPropertySymbols` 获取所有的Symbol私有属性「数组」

```javascript
[
    ...Object.keys(obj),
    ...Object.getOwnPropertySymbols(obj)
].forEach(key => {
    console.log(key, obj[key]);
});
```


# 面向对象练习题

[20201218/2.js]  

```javascript
function C1(name) {
    if (name) {
        this.name = name;
    }
}

function C2(name) {
    this.name = name;
}

function C3(name) {
    this.name = name || 'join';
}
C1.prototype.name = 'Tom';
C2.prototype.name = 'Tom';
C3.prototype.name = 'Tom';
alert((new C1().name) + (new C2().name) + (new C3().name));
// 'Tom' + undefined + 'join' => 'Tomundefinedjoin'
```

[202018/3.png]  

* 重定向

```javascript
function Fn() {
    let a = 1;
    this.a = a;
}
Fn.prototype.say = function () {
    this.a = 2;
}
Fn.prototype = new Fn;
let f1 = new Fn;

Fn.prototype.b = function () {
    this.a = 3;
};
console.log(f1.a);
console.log(f1.prototype);// undefined
console.log(f1.b);
console.log(f1.hasOwnProperty('b'));
console.log('b' in f1);
console.log(f1.constructor == Fn);
```

## rewrite 查找公共属性的方法

```javascript
let A = Symbol('AA');

function Fn() {
    this.x = 100;
    this[A] = 100;
    this.getX = function () {};
}
Fn.prototype[A] = 1000;
Fn.prototype.getX = function () {};
let f1 = new Fn;
```

```javascript
console.log(f1.hasOwnProperty('getX')); //->true  只要私有有这个属性，结果就是true
console.log(f1.hasOwnProperty(A)); //->true  支持Symbol的私有属性检测
```

```javascript
// 扩展到内置类的原型上，这样后期直接基于 对象.hasPubProperty(...) 即可调用
Object.prototype.hasPubProperty = function hasPubProperty(attr) {
    // this->f1
    let self = this,
        prototype = Object.getPrototypeOf(self);
    while (prototype) {
        // 检测是否存在ATTR这个属性
        if (prototype.hasOwnProperty(attr)) return true;
        // 内置属性不可枚举 下面的方法toString无法检测
        /* var keys = Object.keys(prototype);
        if (typeof Symbol !== "undefined") {
            keys = keys.concat(Object.getOwnPropertySymbols(prototype));
        }
        if (keys.indexOf(attr) > -1) return true; */
        // 一直按照原型链查找
        prototype = Object.getPrototypeOf(prototype);
    }
    return false;
};
// 最终目的：原型链上的公有属性返回true，私有的或没有的是false
console.log(f1.hasPubProperty('x')); //->false
console.log(f1.hasPubProperty('getX')); //->true
console.log(f1.hasPubProperty(A)); //->true
console.log(f1.hasPubProperty('toString')); //->true   Object.prototype
// prototype chain 查找逻辑，如下
// f1 -> Fn.prototype -> Object.prototype
```