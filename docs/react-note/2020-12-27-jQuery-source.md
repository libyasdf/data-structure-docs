---
order: 17
title: jQuery源码分析
group:
    title: jQuery环境区分 冲突解决 
    order: 1
---

# jQuery环境区分（20201213）

 * JS代码执行的环境：
    + 浏览器：PC端、移动端 「webkit、gecko、trident、blink...」
    + Hybrid混合APP开发：把H5页面嵌入都native app（IOS/安卓）的webview中「webkit」
    -----window GO

    + node：一个基于v8引擎，渲染和解析JS的环境
    -----没有window，全局对象global

    + 小程序

`var A = typeof window !== "undefined" ? window : this;`
* 如果A===window：说明是在浏览器、webview中运行
* 如果是在Node环境下运行，A可能是Global，也可能是当前模块


* 浏览器环境下执行这个函数
      + window -> window
      + noGlobal -> undefined
    * webpack环境下导入执行
      + window -> window
      + noGlobal -> true

```JavaScript
var B = function (window, noGlobal) {    
    "use strict";

    var version = "3.5.1",
        jQuery = function (selector, context) {
            return new jQuery.fn.init(selector, context);
        };

    if (typeof noGlobal === "undefined") {
        // 浏览器直接导入 <script src='jquery.min.js'></script>
        // 闭包导致需要使用window，暴露jquery出来        
        window.jQuery = window.$ = jQuery;
    }

    return jQuery;
};
```

```JavaScript
(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        // module & module.exports 是CommonJS模块规范「Node」
        module.exports = global.document ?
            // 即支持CommonJS规范，也有window 例如：sea.js  例如：webpack工程化环境
            // =>module.exports=jQuery;整体相当于这样
            导入方式：
            //   + import $ from 'jquery'   $->jQuery
            //   + let $=require('jquery')  $->jQuery
            factory(global, true) :// 执行的B，导出是jquery
            // 支持CommonJS规范，没有window
            function (w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else {
        // 不支持CommonJS规范的「浏览器环境」
        // global->window
        // <script src='jquery.min.js'></script>
        factory(global);
    }
})(A, B);
```

## 借鉴意义

[封装方法](20201213/utils.js)  

* 当自己封装方法，供他人使用时，防止命名冲突:

```JavaScript
(function(){

})()
```

* 暴露方法

直接在自执行方法中`return utils`，将整个自执行函数赋值给`let utils = `，可以支持在HTML中script引用使用，**但是不支持commonJS规范。**

* 暴露API「支持浏览器直接导入 & webpack CommonJS模块导入」

```JavaScript
// 支持浏览器直接导入
if (typeof window !== "undefined") {
    window.utils = utils;
}
// webpack 、支持commonJS规范 
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = utils;
}
```

* 提前处理环境的方式（模仿jquery）

```JavaScript
(function (global, factory) {
    "use strict";
    // 提前在这里处理好
    if (typeof module === "object" && typeof module.exports === "object") {
        // webpack环境
        module.exports = factory(global, true);
    } else {
        // 浏览器导入
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {    
    // 无论如何都是直接把这个函数执行
    var utils = {};
    // ...
    if (noGlobal === undefined) {
        window.utils = utils;
    }

    return utils;
});
```

### 番外: amd思想(现在基本不用了)

#### jquery如何支持的amd思想

```JavaScript
if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}

```

# 闭包应用及冲突处理

## factory函数

* 两个问题：
  + 冲突处理
    例如：模仿jquery的zepto「小型为移动端而生的“jquery”罢了」，里面也有`$`。如果先引入的是zepto，则它会占有`$`。后引入的JQ会抢走`$`的“使用权”。

  + 暴露API 

```JavaScript
function factory(window, noGlobal) {
    "use strict";
    var jQuery = function (selector, context) {
        return new jQuery.fn.init(selector, context);
    };

    // ...

    /* 冲突处理 */
    var _jQuery = window.jQuery,
        _$ = window.$;
    // 转让`$`
    jQuery.noConflict = function (deep) {
        if (window.$ === jQuery) {
            window.$ = _$;
        }
        if (deep && window.jQuery === jQuery) {
            window.jQuery = _jQuery;
        }
        return jQuery;
    };

    /* 暴露API */
    if (typeof define === "function" && define.amd) {
        define("jquery", [], function () {
            return jQuery;
        });
    }
    if (typeof noGlobal === "undefined") {
        window.jQuery = window.$ = jQuery;
    }
    return jQuery;
}
```

#### 自己如何重新决定jquery的名字：

[上述代码在HTML中的触发原因](20201213/index.html)  

```JavaScript
var j = jQuery.noConflict(true);// 解决冲突 
```

# jQuery数据类型检测的处理（2020122/1.js）

* 数据扁平化

```javascript
var flat = arr.flat ? function (array) {
    return arr.flat.call(array);
} : function (array) {
    return arr.concat.apply([], array);
};
```

* 检测是否为函数时注意，nodeType的类型

```javascript
// We don't want to classify *any* DOM node as a function.
typeof obj.nodeType !== "number";// 排除节点
```

```javascript
(function () {
    "use strict";
    var class2type = {};
    var getProto = Object.getPrototypeOf;
    // 将原型链上的方法 附到变量上
    var toString = class2type.toString; //->Object.prototype.toString
    var hasOwn = class2type.hasOwnProperty; //->Object.prototype.hasOwnProperty
    var fnToString = hasOwn.toString; //->Function.prototype.toString 转字符串用
    var ObjectFunctionString = fnToString.call(Object); //->Object.toString()  //->"function Object() { [native code] }"

    // 建立数据类型检测的映射表
    var arr_type = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error", "Symbol", "BigInt"];
    arr_type.forEach(function (name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    
    // 通用检测方法
    var toType = function toType(obj) {
        if (obj == null) return obj + "";// == 检测null 与 undefined
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    };

    // 检测是否为函数
    var isFunction = function isFunction(obj) {
        // In some browsers, typeof returns "function" for HTML <object> elements
        // (i.e., `typeof document.createElement( "object" ) === "function"`).
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    };

    // 检测是否为window
    var isWindow = function isWindow(obj) {
        return obj != null && obj === obj.window;
    };

    // 检测是否为数组或者类数组
    var isArrayLike = function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length,
            type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) return false;// 排除掉function 与 window
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;// 类数组
    };

    // 检测是否为纯粹的对象（obj.__proto__===Object.prototype）
    var isPlainObject = function isPlainObject(obj) {
        var proto, Ctor;
        if (!obj || toString.call(obj) !== "[object Object]") return false;
        proto = getProto(obj);

         // Object.create(null)
        if (!proto) return true;
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    };

    // 检测当前对象是否为空对象
    var isEmptyObject = function isEmptyObject(obj) {
        if (obj == null) return false;
        var keys = Object.keys(obj);
        // 检测支持ES6
        if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));// 把symbol属性的节点也加上
        return keys.length === 0;
    };

    // 检测是否为有效数字，认为：10和"10"都是有效数字，但是true/null这些都不是
    var isNumeric = function isNumeric(obj) {
        var type = toType(obj);
        return (type === "number" || type === "string") && !isNaN(obj);
    };

    /* 暴露API */
    var utils = {
        toType: toType,
        isFunction: isFunction,
        isWindow: isWindow,
        isArrayLike: isArrayLike,
        isPlainObject: isPlainObject,
        isEmptyObject: isEmptyObject,
        isNumeric: isNumeric
    };

    // 转让使用权
    var _$ = window._;
    utils.noConflict = function noConflict() {
        if (window._ === utils) window._ = _$;
        return utils;
    };

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = utils;
    }
    if (typeof window !== "undefined") {
        window._ = window.utils = utils;
    }
})();

```

### 检测是不是window

* 因为`window.window === window`
  + 所以，`return obj != null && obj === obj.window`;


* 转换为boolean值`!!（0/“”/null/ undefined/ NaN）`()里的部分会转化为false-Boolean


# 基本骨架和工厂模式的应用 （2020122/2.js/1.png）

[jQuery API 3.5.1 速查表](https://jquery.cuishifeng.cn)   

$ -> jQuery
$('.box').addClass()
   + $(...) -> 创造jQuery类的实例  JQ对象「jQuery的实例对象」
   + jQuery是一个函数「构造函数」

JQ是一个类库「提供大量的方法」
  + jQuery.prototype  供其实例调用的「$(...).xxx()」
  + jQuery.xxx 静态私有的属性和方法  「$.xxx()」

* $() 就是-> jQuery()
* $.fn 就是-> jQuery.prototype 

* $('.box a')
* $('a',box)

```javascript
var
    version = "3.5.1",
    jQuery = function jQuery(selector, context) {
        // selector:选择器类型 「字符串（选择器/HTML字符串）、函数、DOM元素对象...」
        // context:上下文，限制其获取的范围
        return new jQuery.fn.init(selector, context);
    };

// 原型方法：供实例调用
jQuery.fn = jQuery.prototype = {// 原型重定向
    jquery: version,
    constructor: jQuery,// 补充constructor
    // ...
};

// 把其当做普通对象，设置的静态私有属性和方法
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
// ...


var rootjQuery = jQuery(document),
    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
    init = jQuery.fn.init = function (selector, context, root) {
        var match, elem;

        // HANDLE: $(""), $(null), $(undefined), $(false)
        if (!selector) {
            return this;
        }

        // Method init() accepts an alternate rootjQuery
        // so migrate can support jQuery.sub (gh-2101)
        root = root || rootjQuery;

        // Handle HTML strings
        if (typeof selector === "string") {
            if (selector[0] === "<" &&
                selector[selector.length - 1] === ">" &&
                selector.length >= 3) {

                // Assume that strings that start and end with <> are HTML and skip the regex check
                match = [null, selector, null];

            } else {
                match = rquickExpr.exec(selector);
            }

            // Match html or make sure no context is specified for #id
            if (match && (match[1] || !context)) {

                // HANDLE: $(html) -> $(array)
                if (match[1]) {
                    context = context instanceof jQuery ? context[0] : context;

                    // Option to run scripts is true for back-compat
                    // Intentionally let the error be thrown if parseHTML is not present
                    jQuery.merge(this, jQuery.parseHTML(
                        match[1],
                        context && context.nodeType ? context.ownerDocument || context : document,
                        true
                    ));

                    // HANDLE: $(html, props)
                    if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                        for (match in context) {

                            // Properties of context are called as methods if possible
                            if (isFunction(this[match])) {
                                this[match](context[match]);

                                // ...and otherwise set as attributes
                            } else {
                                this.attr(match, context[match]);
                            }
                        }
                    }

                    return this;

                    // HANDLE: $(#id)
                } else {
                    elem = document.getElementById(match[2]);

                    if (elem) {

                        // Inject the element directly into the jQuery object
                        this[0] = elem;
                        this.length = 1;
                    }
                    return this;
                }

                // HANDLE: $(expr, $(...))
            } else if (!context || context.jquery) {
                return (context || root).find(selector);

                // HANDLE: $(expr, context)
                // (which is just equivalent to: $(context).find(expr)
            } else {
                return this.constructor(context).find(selector);
            }

            // HANDLE: $(DOMElement)
        } else if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;

            // HANDLE: $(function)
            // Shortcut for document ready
        } else if (isFunction(selector)) {
            return root.ready !== undefined ?
                root.ready(selector) :

                // Execute immediately if ready is not present
                selector(jQuery);
        }

        return jQuery.makeArray(selector, this);
    };
init.prototype = jQuery.fn;
```
## 如何使用时不new来 创建实例

### 工厂模式

* 源码中返回值为`new jQuery.fn.init`
  + 而这个值来自，`init = jQuery.fn.init = function`...
  + 这种方式叫做**工厂模式**

* 所以可以使用方法时，为了可以之接`$()`而不必`new $()`，使用工厂模式。（反例比如，`new Swiper()`）
  + 让`jQuery.fn.init`指向`jQuery.prototype`。(`init.prototype = jQuery.fn`)

# 选择器的处理步骤（20201225）

  `$()` -> 返回的都是JQ类的实例(JQ对象) 「格式：空实例对象、类数组集合...」
 
 * `selector` 支持的格式(返回什么)
   + null/undefined/""/0/NaN/false  返回一个空JQ对象
   + `string`:选择器（获取元素的类数组集合）/`HTML`字符串（创建DOM对象，返回JQ实例，也就是一个类数组集合）
   + `selector.nodeType`原生的DOM元素对象:把原生DOM对象转换为JQ对象目的是调用JQ原型上的方法  
   + 函数:`$(函数)`  （就是）=> `$(document).ready(函数)`  
       + 等待页面中的DOM结构都加载完成(`DOMContentLoaded`)，就会触发执行函数
       + 当做闭包，防止全局变量污染，`$(function(){ ... })`-这样放到哪里都能获取到DOM
   + DOM元素/节点集合/...：一个JQ实例对象（类数组集合）`jQuery.makeArray(selector, this)`

* 把JQ对象(一般类数组集合) 转换为 原生DOM对象：可以调用浏览器提供的内置的属性和方法`$("*")`
  + 基于JQ集合中的某个索引获取即可  `$(xxx)[index]`  ->DOM对象
* jQ与DOM的转化
  + `$(xxx).get([index])`支持负数  -> 原生DOM对象
  + `$(xxx).eq([index])` -> 新的JQ实例对象
* 回到根级
  + `$('#box').addClass('box').parent().css('color','red').prevObject`

```javascript
let $box = $('#box');// 只创建一个实例
$box.addClass('active');
$box.siblings().removeClass('active');
```

# each方法的分析和封装 （20201225/lib/utils.js）

内置循环机制：
```javascript
$('*').addClass('box')

$("*").each(function(){
    var $self = $(this);
    $self.addClass('box')
})
```

# extend和对象的深浅拷贝合并（20201227）

1. 向jQuery的prototype和对象上扩展属性和方法

```javascript
$.extend({ // 给jQuery对象扩展xxx属性方法 -> 用的时候，这样 $.xxx() -> 完善类库
    xxx() {}
});
/* fn是jq的原型，写在原型上给实例用 */
$.fn.extend({ // 给jQuery.prototype扩展xxx方法 -> $().xxx() -> JQ插件编写
    xxx() {}
}); 

// $.fn 给实例用
// $() 给DOM用
// $ 一般的工具类方法

// 封装插件的行为
$.fn.extend({
    buttonClick() {
        // this -> JQ实例
        // jq的实例，前面写上$
        let $self = this;
        $self.click(function () {
            $self.css('background', 'lightblue');

            let text = $self.html();
            $self.html(text + text);
        });
    }
});

let $btn1 = $('#btn1'),
    $btn2 = $('#btn2');
$btn1.buttonClick();
$btn2.buttonClick(); 
```


# 实现对象和对象之间的比较和合并「深合并、浅合并」

```javascript
let obj1 = {
    name: 'zhufeng',
    age: 12,
    headers: {
        token: 'javascript',
        x: 200,
        y: {
            n: 10
        }
    }
};

let obj2 = {
    name: 'zhouxiaotian',
    headers: {
        token: 'good good study',
        score: 100,
        y: {
            m: 20
        }
    },
    height: 180
};

let obj3 = {
    age: 18,
    height: 190,
    weight: '60KG',
    headers: {
        name: '哇咔咔'
    }
};

let obj = _.merge(true, obj1, obj2, obj3);
console.log(obj === obj1, obj);
```

```javascript
// true 深合并
let obj = $.extend(true, obj1, obj2);
console.log(obj === obj1, obj);

console.log($.extend(obj1, obj2, obj3));
console.log($.extend({}, obj1, obj2, obj3));

// 浅合并，等价于Object.assign
let obj = $.extend(obj1, obj2);
console.log(obj === obj1, obj);

// 基于浅比较的合并：只比较第一级结构，从而进行合并「浅合并」
let obj = Object.assign(obj1, obj2);
console.log(obj === obj1, obj);
```


```javascript
* 自己写一个支持用户自定义扩展属性和方法的extend
// 依赖 utils.js 里面有一些工具方法
(function (_) {// _ 代表 util.js
    function ModalPlugin() {}
    // ...

    ModalPlugin.extend = ModalPlugin.prototype.extend = function (obj) {
        var self = this;
        _.each(obj, function (value, key) {
            self[key] = value;
        });
        return self;
    };

    // ...
})(utils);
ModalPlugin.extend({

});
ModalPlugin.prototype.extend({

}); 
```

```javascript
jQuery.extend = jQuery.fn.extend = function () {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {}, //传递的第一项
        i = 1,
        length = arguments.length, //传递实参的个数
        deep = false; //是否为深比较合并

    // $.extend(true,obj1,obj2...)
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[i] || {}; //target -> 传递的第一个对象
        i++; //i -> 2
    }
    
    if (typeof target !== "object" && !isFunction(target)) target = {};

    // $.extend(obj) || $.fn.extend(obj) || $.extend(true,obj)
    if (i === length) {
        target = this; //target -> $/$.fn
        i--; //i -> 0/1 传递进来obj在ARGS集合中的索引
    }

    for (; i < length; i++) {
        // $/$.fn.extend(obj) -> target:$/$.fn  options:obj
        // $.extend([true?],obj1,obj2,obj3...) -> target:obj1  options:obj2/obj3/...
        if ((options = arguments[i]) != null) {// 先赋值再判断
            // 把options中的每一项替换target中的
            for (name in options) {
                copy = options[name]; //copy -> options每一项的值

                // Prevent Object.prototype pollution
                // Prevent never-ending loop
                if (name === "__proto__" || target === copy) {
                    continue;// 防止无限递归
                }
                // 对象和数组才能深合并
                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    // 只有 options 中获取的这一项是 纯粹的对象/数组 才有必要进行深度比较合并
                    src = target[name]; // copy->options这一项值  src->target中的这一项值
                    if (copyIsArray && !Array.isArray(src)) {
                        clone = [];
                    } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                        clone = {};
                    } else {
                        clone = src;
                    }
                    // clone 替换 src「target中的这一项值」
                    copyIsArray = false;
                    // 递归
                    target[name] = jQuery.extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    // 浅合并:只需要把options中的每一项copy，替换target中当前同名这一项即可
                    target[name] = copy;
                }
            }
        }
    }
    return target;
};
```
## 参数处理

非想要的格式，变成想要的格式
`arguments[0] || {}`

# 20201227/lib/utils.js

* extend和对象的深浅拷贝合并(2)

```javascript
    // 实现「数组/纯粹对象」深浅合并
    var merge = function merge() {
        var options, src, copyIsArray,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== "object" && !isFunction(target)) target = {};
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                each(options, function (copy, name) {
                    // 防止死递归
                    if (target === copy) return;
                    copyIsArray = Array.isArray(copy);
                    if (deep && copy && (isPlainObject(copy) || copyIsArray)) {
                        src = target[name];
                        if (copyIsArray && !Array.isArray(src)) {
                            src = [];
                        } else if (!copyIsArray && !isPlainObject(src)) {
                            src = {};
                        }
                        // 
                        target[name] = merge(deep, src, copy);
                        return;
                    }
                    // 
                    target[name] = copy;
                });
            }
        }
        return target;
    };
```

## copy

### 浅拷贝

1. 最low
```
let copy = {};
_.each(obj, (value, key) => copy[key] = value);
```

2. 基于ES6
```
let copy = {
    ...obj
};
let copy = Object.assign({}, obj);
```

3. 数组中的拷贝，方法更多
```
let arr = [10, 20];
let copy = [...arr];
copy = arr.slice(0);
```

### 数组和对象的深拷贝：

* 先JSON.stringify / 后JSON.parse 
  + 在JSON.stringify变为字符串的时候，很多类型的属性值都会有问题（缺点）
    + 正则/Error->{}
    + 日期->字符串
    + undefined/function/symbol->丢了
    + bigint->直接报错

>浏览器在parse的时候，会重新开辟所有需要的内存空间

自己实现：

* 正则/日期 new -> 深clone
  + 

* 函数 

  ```javascript
  // “深”clone - 包一层
  let fn2 = function(x) {
      return fn(x);
  }
  ```
* 引用类型
  + Object(time) -> 浅克隆

```javascript
    // 实现「数组/纯粹对象,其余类型的值,直接浅克隆即可」深浅克隆
    var clone = function clone(deep, obj, cache) {
        var type, Ctor, copy;
        if (typeof deep !== "boolean") {
            obj = deep;
            deep = false;
        }

        // 死递归的优化处理
        !Array.isArray(cache) ? cache = [] : null;
        if (cache.indexOf(obj) > -1) return obj;
        cache.push(obj);

        // 原始值类型直接返回
        if (obj == null) return obj;
        if (!/^(object|function)$/.test(typeof obj)) return obj;

        // 特殊值的处理
        type = toType(obj);
        Ctor = obj.constructor;
        if (/^(number|string|boolean|regexp|date)$/.test(type)) return new Ctor(obj);
        if (type === "error") return new Ctor(obj.message);
        if (type === "function") {
            // 包一层
            return function proxy() {
                var params = [].slice.call(arguments);// arguments变数组
                return obj.apply(this, params);// 传参
            };
        }
        // 不是「数组」和「纯粹对象」，就不用往下走
        if (!isPlainObject(obj) && !Array.isArray(obj)) return obj;
        // 纯粹对象和数组
        copy = new Ctor();
        each(obj, function (value, key) {
            if (deep) {
                // 深拷贝
                copy[key] = clone(deep, value, cache);
                return;
            }
            // 浅拷贝
            copy[key] = value;
        });
        return copy;
    };
```

调用

```javascript
let obj = {
    x: 100,
    y: 200,
    score: [100, 200],
    detai: {
        english: 100,
        math: 200,
        total: {
            1: 100,
            2: 200
        }
    },
    queryDetail: function () {
        console.log(this.detai);
    },
    reg: /^\d+$/,
    time: new Date,
    pai: null,
    zou: undefined,
    xxx: new Error()
};
obj.obj = obj;

let copy = _.clone(true, obj);
```