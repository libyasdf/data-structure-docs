---
order: 17
title: jQuery源码分析
group:
    title: jQuery环境区分 冲突解决 
    order: 1
---
（20201213）
# jQuery环境区分

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