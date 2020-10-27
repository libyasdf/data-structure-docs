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
```
//需要插入的容器
let ul = document.getElementById('container');
// 插入十万条数据
let total = 100000;
// 一次插入 20 条
let once = 20;
//总页数
let page = total/once
//每条记录的索引
let index = 0;
//循环加载数据
function loop(curTotal,curIndex){
    if(curTotal <= 0){
        return false;
    }
    //每页多少条
    let pageCount = Math.min(curTotal , once);
    window.requestAnimationFrame(function(){
        let fragment = document.createDocumentFragment();
        for(let i = 0; i < pageCount; i++){
            let li = document.createElement('li');
            li.innerText = curIndex + i + ' : ' + ~~(Math.random() * total)
            fragment.appendChild(li)
        }
        ul.appendChild(fragment)
        loop(curTotal - pageCount,curIndex + pageCount)
    })
}
loop(total,index);
```
[虚拟列表](https://juejin.im/post/6844903982742110216)  
```
列表总高度listHeight = listData.length * itemSize
可显示的列表项数visibleCount = Math.ceil(screenHeight / itemSize)
数据的起始索引startIndex = Math.floor(scrollTop / itemSize)
数据的结束索引endIndex = startIndex + visibleCount
列表显示数据为visibleData = listData.slice(startIndex,endIndex)
```
### 笔记提炼:

>大量数据渲染的时候，JS运算并不是性能的瓶颈，性能的瓶颈主要在于渲染阶段——[从多线程到Event Loop全面梳理](https://juejin.im/post/6844903919789801486)

用requestAnimationFrame代替setTimeout来解决丢帧问题，它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象。

继续优化：**DocumentFragment**(不会引起页面回流)[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)  



# 回流与重绘

说一下什么场景会触发
[两者的区别](https://www.jianshu.com/p/e081f9aa03fb)  
[回流与重绘-知乎](https://zhuanlan.zhihu.com/p/52076790?utm_medium=social&utm_source=wechat_session)  

笔记：
每次重排都会造成额外的计算消耗，大多数浏览器都会通过队列化修改并批量执行来优化重排过程。  

浏览器会将修改操作放入到队列里，直到过了一段时间或者操作达到了一个阈值，才清空队列。

但当获取布局信息的操作的时，会强制队列刷新，如访问以下属性或者使用以下方法：

[引起回流的属性-GitHub](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)  
```
offsetTop、offsetLeft、offsetWidth、offsetHeight
scrollTop、scrollLeft、scrollWidth、scrollHeight
clientTop、clientLeft、clientWidth、clientHeight
getComputedStyle()
```

### 优化
1、最小化重绘和重排
合并几次的物理样式调节，改一次class，就不要分着改几次style属性。

2、批量修改DOM
* 使元素脱离文档流（layout）
* 对其进行多次修改（已经不在渲染树）
* 将元素带回到文档中（layout）

三种方式可以让DOM脱离文档流：

* 隐藏元素，应用修改，重新显示
* 使用文档片段(document fragment)在当前DOM之外构建一个子树，再把它拷贝回文档。
```
const fragment = document.createDocumentFragment();
```
* 将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始的元素。

**修改前和修改后的性能。然而实验结果不是很理想。**

_原因_ 浏览器会使用队列来储存多次修改，进行优化，所以对这个优化方案，我们其实不用优先考虑。

**解决**
```
计算相关，代码中的：
box.offsetWidth

改为：
const width = box.offsetWidth;
放在代码循环外
```

3、对于复杂动画效果,使用绝对定位让其脱离文档流

使用绝对定位

4、css3硬件加速（GPU加速）

常见的触发硬件加速的css属性：
```
transform
opacity
filters
Will-change
```

**缺点**

如果你为太多元素使用css3硬件加速，会导致*内存占用较大*，会有性能问题。  
在GPU渲染字体会导致抗锯齿无效。这是因为GPU和CPU的算法不同。因此如果你不在动画结束的时候关闭硬件加速，会产生*字体模糊*。

# 封装组件

