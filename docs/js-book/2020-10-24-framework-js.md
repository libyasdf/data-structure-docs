---
order: 6
title: 框架问题
group:
    title: 框架
    order: 1
---

# 2个页面怎么进行通讯

同域名的2个页面怎么通讯
不同域的2个页面怎么通讯

# 虚拟dom
[vue为例](https://juejin.im/post/6844904166742048782#heading-0)  

说下你对虚拟dom的理解
虚拟dom的实现原理
虚拟dom的优缺点

# 为什么data要设置成函数

# 长列表优化
~比较不错~
[「前端进阶」高性能渲染十万条数据(时间分片)](https://juejin.im/post/6844903938894872589)  

### 笔记提炼:

>大量数据渲染的时候，JS运算并不是性能的瓶颈，性能的瓶颈主要在于渲染阶段——[从多线程到Event Loop全面梳理](https://juejin.im/post/6844903919789801486)

用requestAnimationFrame代替setTimeout来解决丢帧问题，它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象。

继续优化：**DocumentFragment**(不会引起页面回流)[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)  



