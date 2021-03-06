---
order: 18
title: debounce throttle
group:
    title: debounce throttle
    order: 1
---
[20201213/5.js/6.js](index2.html)  

# 防抖

方案一：加标示

```javascript
let isRuning = false;

submit.onclick = function () {
    if (isRuning) return;
    isRuning = true;
    // 异步请求「模拟每一次请求1000ms才可以获取到结果」
    setTimeout(() => {
        $.ajax({
            url: './code.txt',
            success(result) {
                console.log(result);
                isRuning = false;
            }
        });
    }, 1000);
};
```
缺点：方法多的时候，不能每个都写一套

解决：方案二 公共防抖方法

* debounce核心思想：函数防抖在频繁触发的模式下，我们**只识别一次**「可以只识别第一次 `immediate=true`，也可以识别最后一次」

* debounce与**throttle**：都会设置一个WAIT时间，此时间是用户自己定义，多久内触发多次算是频繁触发。假设，持续一分钟的点击。
  + 防抖：是只识别一次
  + 节流：每隔“500ms”执行一次

```javascript
// 每一次点击都设置一个定时器，间隔WAIT这么久执行HANDLE；
// 如果上一次定时器还没有执行「说明还没有到WAIT这么久」，就执行了下一次了，此时我们把上一次的干掉，重新设置即可
function debounce(func, wait, immediate) {
    if (typeof func !== "function") throw new TypeError('func must be a function!');
    if (typeof wait === "undefined") {
        wait = 500;
        immediate = false;
    }
    if (typeof wait === "boolean") {
        immediate = wait;
        wait = 500;
    }
    if (typeof wait !== "number") throw new TypeError('wait must be a number!');
    if (typeof immediate !== "boolean") throw new TypeError('immediate must be a boolean!');

    var timer = null,
        result;

    return function proxy() {
        var self = this,// 类数组变数组
            params = [].slice.call(arguments),// 为了兼容用arguments，而非rest
            callNow = !timer && immediate;// 第一次点击时timer为null，提到这个位置，因为后续会改变timer
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
            // 执行完之后，清除最后一次定时器
            clearTimeout(timer);
            timer = null;
            // 符合执行的是最后一次「触发在结束边界」
            if (!immediate) result = func.apply(self, params);
        }, wait);
        // 符合第一次立即执行「触发在开始的边界」
        if (callNow) result = func.apply(self, params);
        return result;
    };
}

const handle = function handle(ev) {
    console.log(this, ev);
    /* setTimeout(() => {
        $.ajax({
            url: './code.txt',
            success(result) {
                console.log(result);
            }
        });
    }, 1000); */
};
// 用户疯狂点击，proxy函数会疯狂的执行，但是我们最后要执行的是handle，所以我们只需要在proxy执行多次的时候，基于一些列的判断处理，让handle只执行一次即可。
submit.onclick = debounce(handle, true);
// submit.onclick = handle; //this->submit  传递一个事件对象ev
```

* timer数字，代表当前是第几个定时器
`let timer = setTimeout(() => {}, 1000);`

* 清除定时器 
`clearTimeout(timer);`
此时timer还是数字，此时我们最好把他赋值为null，这样我们后期可以基于timer是否为null来验证定时器是否存在
`timer = null; `


如果只考虑ES6:

```javascript
function debounce(func, wait, immediate) {
    let timer = null;
    return function proxy(...params) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func.call(this, ...params);
        }, wait);
    };
}
```

# 节流

* 设置一个WAIT时间，此时间是用户自己定义，多久内触发多次算是频繁触发
* 函数节流：在频繁触发的模式下，我们每间隔WAIT这么久，就触发一次
* 节流的目的：是降低触发频率 （debounce是只触发一次）

```javascript
const handle = function handle(ev) {
    console.log(this, ev);
    // console.log('OK');
};

function throttle(func, wait) {
    if (typeof func !== "function") throw new TypeError('func must be a function!');
    wait = +wait;
    if (isNaN(wait)) wait = 300;
    var timer = null,
        previous = 0,
        result;
    return function proxy() {
        // 此函数不能改成尖头函数，因为还是想要保留this。否则就全是window
        var self = this,
            params = [].slice.call(arguments);
        var now = +new Date,// 当前时间 距离1970.1.1的毫秒差
            remaining = wait - (now - previous);// 计算间隔时间
        if (remaining <= 0) {
            // 两次间隔时间已经超过WAIT了，没必要设置定时器了，此时我们立即执行
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            previous = now;
            result = func.apply(self, params);
            return result;
        }
        // 没有定时器我们才设置，有定时器说明上次还没执行。只有上一次执行了，再开启下一次
        if (!timer) {
            timer = setTimeout(function () {
                clearTimeout(timer);
                timer = null;
                previous = +new Date;
                result = func.apply(self, params);
            }, remaining);
        }
        return result;
    };
}

// 监听滚动条滚动，触发执行方法
// 问题：滚动条滚动中，浏览器最快的反应时间内则会触发一次  谷歌：5~6ms  IE:10~17ms
// 优化点：没有必要频繁触发
window.onscroll = throttle(handle);
// window.onscroll = proxy;  每间隔5~6ms触发一次proxy，但是最后执行的还是handle，我们在proxy中能够控制handle执行的频率即可
```

# 调试技巧

VS liveServe插件，右键`open with liveServer`。就可以通过http/https协议打开本地HTML（才能支持ajax请求）

* 本地启动了一个web服务器 端口5500 支持热更新

* file://是本地协议，不能发送ajax请求。外力借助iis、nginx、apache、node启动一个web server（然后基于服务访问HTML）。





