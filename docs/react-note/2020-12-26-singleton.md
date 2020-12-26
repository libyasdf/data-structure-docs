---
order: 16
title: 高阶编程技巧
group:
    title: 单例设计模式 惰性函数
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

