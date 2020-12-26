---
order: 16
title: 高阶编程技巧
group:
    title: 单例设计模式 惰性函数 柯理化函数
    order: 1
---

# 单例设计模式

#### 思路：
合作时重名问题 -> 用闭包解决 -> 闭包导致无法访问其它闭包中的方法 -> window.xxx -> 污染了全局

* 都写在全局下，会存在全局变量污染的问题
  + 基于闭包的方式解决全局污染问题「无法直接调用其它模块下的方法（冗余没有解决）」
    + window.xxx = xxx 解决代码重复的问题，但污染全局  暴露的API不易过多
    + 基于对象分组的特点：把当前需要供别人调用的API/信息放置在一个堆中，让utils指向这个堆，后期基于utils就可以访问到堆中的API

* 高级单例设计模式「基于闭包管理的单例模式」
  + 单独的实例：基于单独的实例，来管理自己模块下的内容，保证不冲突「实现的是分组」
  + namespace：命名空间{把描述相同的事物的属性和方法放置在同一个命名空间下，来实现分组特点，减少全局变量污染 => 单例设计模式

* 而基于**闭包**的方式，可以实现模块下部分方法的私有化，也可以基于单例实现API之间的共用 ->最早期的模块化编程思想 

* 后续更优秀的编程思想：
  + AMD（require.js）
  + CMD（sea.js）
  + CommonJS（Node.js）
  + ES6Module

```
let namespace1 = {}; //->Object的一个实例
let namespace2 = {}; //->Object的一个实例 
```

```
// 公共部分
let utils = (function () {
    const debounce = function debounce() {};
    const toType = function toType() {};
    // ...
    return {
        // ES6 debounce:debounce
        debounce,
        toType
    };
})();
```

```
// 搜索区域
let searchModule = (function () {
    let value = null;
    const submit = function submit() {};
    const func = function func() {
        // ...
    };
    utils.debounce(func);

    return {
        submit
    };
})();
```

```
// 天气区域
let weatherModule = (function () {
    let city = '北京';

    const queryData = function queryData(callback) {
        let data = null;
        // ...
        callback && callback(data);
    };

    const bindHTML = function bindHTML() {};

    const changeCity = function changeCity() {};

    return {
        init() {
            // init中管控当前模块下各个业务功能的执行顺序「大脑」  -> 命令设计模式
            // 在单例模式的基础上，出现个统一的方法，管控其它函数的执行顺序，谓之：命令设计模式
            queryData(function () {
                bindHTML();
                changeCity();
            });
        }
    };
})();
weatherModule.init();
```

* 单例模式，返回的就是对象。需要new的，是构造函数模式。

# 惰性函数

```
body :after {

}
```
获取样式使用`window.getComputedStyle(document.body,'after')`，after可以不写，或者写null。`window.getComputedStyle(document.body,'after')['width']`可以获取某一个值。

```
function getCss(element, attr) {
    // 处理兼容
    if (window.getComputedStyle) {
        return window.getComputedStyle(element)[attr];
    }
    return element.currentStyle[attr];
}
```

`document.body.getBoundingClientRect`获得浏览器当前窗口可视化交叉信息。

* 存在性能上的问题，每次都需要判断兼容，达不到“懒”的效果

优化：
```
let utils = (function () {// 自执行函数只执行一次
    let compatible = window.getComputedStyle ? true : false;

    const getCss = function getCss() {
        // 避开了判断
        if (compatible) {
            return window.getComputedStyle(element)[attr];
        }
        return element.currentStyle[attr];
    };

    return {
        getCss
    };
})();
```

### 最后进化：

* 需求：一个超级复杂的业务函数，而且会被执行N次，后续执行，依然想使用第一次执行处理好的逻辑。这样我们不期望每一次执行，逻辑都重新判断一下，此时基于惰性思想「函数重构」可以实现性能的优化。

```
function getCss(element, attr) {
    if (window.getComputedStyle) {
        // 重写了getCss
        // 产生了闭包
        getCss = function (element, attr) {
            return window.getComputedStyle(element)[attr];
        };
    } else {
        getCss = function (element, attr) {
            return element.currentStyle[attr];
        };
    }
    // 第一次把重写后的函数执行，获取对应样式
    return getCss(element, attr);
}

let body = document.body;
console.log(getCss(body, 'width'));
console.log(getCss(body, 'height'));
```


# 柯理化函数

* 柯理化函数 curring：预先处理的思想「**利用闭包**，保存私有上下文中的一些信息，供其下级上下文中调取使用，也就是我们把一些信息先预先保存下来，后期让其下级上下文使用」 => 大函数执行返回小函数。

```
const fn = (...params) => {
    // 闭包:params -> [1,2]
    return (...args) => {
        return params.concat(args).reduce((total, item) => {
            return total + item;
        });
    };
};
fn(1, 2)(3); 
```

```
function fn() {}
fn.toString = function () {
    console.log('一定调我了');
    return 'OK';
};
console.log(fn); //->fn.toString 会调用toString 但是输出的前面标记 `f`
alert(fn); //->fn.toString
```

* 利用上述console.log会调用toString的机制

```
const curring = () => {
    let arr = [];// 闭包思维 保留前值
    const add = (...params) => {
        // 把每一次执行ADD方法传递的值都保留下来
        arr = arr.concat(params);
        return add;
    };
    add.toString = () => {
        // 输出ADD会调用其toString方法
        return arr.reduce((total, item) => total + item);
    };
    return add;
};

let add = curring();
let res = add(1)(2)(3);
console.log(res); //->6

add = curring();
res = add(1, 2, 3)(4);
console.log(res); //->10

add = curring();
res = add(1)(2)(3)(4)(5);
console.log(res); //->15
```

或者：

```
const curring = n => {
    let arr = [],
        index = 0;
    const add = (...params) => {
        index++;
        arr = arr.concat(params);
        if (index === n) {
            return arr.reduce((total, item) => total + item);
        }
        return add;
    };
    return add;
};

let add = curring(3);// 告知循环次数
let res = add(1)(2)(3);
console.log(res); //->6

add = curring(2);
res = add(1, 2, 3)(4);
console.log(res); //->10

add = curring(5);
res = add(1)(2)(3)(4)(5);
console.log(res); //->15

```