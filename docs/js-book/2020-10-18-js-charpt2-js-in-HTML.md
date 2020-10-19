---
order: 2
title: 第二章 HTML 中的 JavaScript
group:
    title: 红宝书
    order: 1
---

# JavaScript 引入网页

>  JavaScript与网页的主导语言 HTML 的关系问题。
JavaScript 早期，希望在将 JavaScript 引入 HTML 页面的同时，不会导致页面在其他浏览器中渲染出问题。达成了向网页中引入通用脚本能力的共识。当初很多工作得到了保留，最终形成了 HTML 规范。

## &lt;script&gt;元素

 >JavaScript 插入 HTML 的主要方法是使用```<script>```元素。

元素有下列 7 个属性(language已废)

*   async：可选。表示应该**立即开始下载脚本**，但不能阻止其他页面动作，比如下载资源或等待其他脚本加载。只对外部脚本文件有效。
*   charset：可选。使用 src 属性指定的代码字符集。这个属性很少使用，**因为大多数浏览器不在乎它的值。**
*   crossorigin：可选。配置相关请求的CORS（跨源资源共享）设置。默认不使用CORS。crossorigin= "anonymous"配置文件请求不必设置凭据标志。crossorigin="use-credentials"设置凭据标志，**意味着出站请求会包含凭据。**
*   defer：可选。表示**脚本可以延迟到文档完全被解析和显示之后再执行**。只对外部脚本文件有效。在 IE7 及更早的版本中，对行内脚本也可以指定这个属性。
*   integrity：可选。允许比对接收到的资源和指定的加密签名以验证子资源完整性（SRI，
Subresource Integrity）。**如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错，脚本不会执行。**这个属性可以用于确保内容分发网络（CDN，Content Delivery Network）不会提供恶意内容。

*   src：可选。表示包含要执行的代码的外部文件。

* type：可选。代替 language，表示代码块中脚本语言的内容类型（也称 MIME 类型）。按照惯例，这个值始终都是"text/javascript"，尽管"text/javascript"和"text/ecmascript"都已经废弃了。
JavaScript 文件的 MIME 类型通常是"application/x-javascript"，不过给type 属性这个值有可能导致脚本被忽略。
在非 IE 的浏览器中有效的其他值还有"application/javascript"和"application/ecmascript"。**如果这个值是 module，**则代码会被当成 ES6 模块，而且只有这时候代码中才能出现 import 和 export 关键字。

>包含在&lt;script&gt;内的代码会被从上到下解释。函数等会被保存在**解释器环境**中。在&lt;script&gt;元素中的代码被计算完成之前，页面的其余内容不会被加载，也不会被显示。

PS：浏览器解析行内脚本的方式决定了它在看到字符串&lt;script&gt;时，会将其当成结束的&lt;script&gt;标签。想避免这个问题，只需要转义字符“\”


***红宝书12页：script标签必须有「起始」及「结束」标签***

PS：如果不打算使用.js 扩展名，一定要确保服务器能返回正确的 MIME 类型

script元素的一个最为强大、同时也备受争议的特性是，它可以包含来自**外部域**的 JavaScript文件。（page 13）

### 标签位置

**过去，**所有script元素都被放在页面的head标签内这种做法的主要目的是把外部的 CSS 和 JavaScript 文件都集中放到一起。不过，把所有 JavaScript文件都放在head里，也就意味着必须把所有 JavaScript 代码都下载、解析和解释完成后，才能开始渲染页面（_页面在浏览器解析到body的起始标签时开始渲染_）

**现代** Web 应用程序通常将所有 JavaScript 引用放在body元素中的页面内容后面

### 推迟执行脚本

defer属性表示脚本在执行的时候不会改变页面的结构。也就是说，脚本会被延迟到整个页面都解析完毕后再运行。

相当于告诉浏览器**立即下载，但延迟执行。**

>HTML5 规范要求脚本应该按照它们出现的顺序执行，因此第一个推迟的脚本会在第二个推迟的脚本之前执行，而且两者都会在 DOMContentLoaded 事件之前执行（关于事件，请参考第 17 章）。不过在实际当中，推迟执行的脚本不一定总会按顺序执行或者在DOMContentLoaded事件之前执行，因此最好只包含一个这样的脚本。

考虑到浏览器支持，还是把要推迟执行的脚本放在页面底部比较好

注意 对于 XHTML 文档，指定 defer 属性时应该写成 defer="defer"。

### 异步执行脚本

>添加 async 属性的目的是告诉浏览器，不必等脚本下载和执行完后再加载页面，同样也不必等到该异步脚本下载和执行后再加载其他脚本。**正因为如此，异步脚本不应该在加载期间修改 DOM。**


标记为 async 的脚本并**不保证能按照它们出现的次序执行**

脚本添加 async 属性的目的是告诉浏览器，不必等脚本下载和执行完后再加载页面，同样也不必等到该异步脚本下载和执行后再加载其他脚本。

对于 XHTML 文档，指定 async 属性时应该写成 async="async"。

<u>async defer 它们两者也都只适用于外部脚本</u>

### 动态加载脚本

```
let script = document.createElement('script'); 
script.src = 'gibberish.js'; 
document.head.appendChild(script);
```
在把 HTMLElement 元素添加到 DOM 且执行到这段代码之前不会发送请求。默认情况下，
以这种方式创建的script元素是以**异步方式**加载的，相当于添加了 async 属性。不过这样做可能会有问题，因为所有浏览器都支持 createElement()方法，但不是所有浏览器都支持 async 属性。

因此，如果要统一动态脚本的加载行为，可以明确将其设置为同步加载：
```
let script = document.createElement('script'); 
script.src = 'gibberish.js'; 
script.async = false; 
document.head.appendChild(script);
```
>以这种方式获取的资源对浏览器预加载器是不可见的。这会*严重影响*它们在资源获取队列中的优先级。  
根据应用程序的工作方式以及怎么使用，这种方式可能会严重影响性能。要想让预加载器知道这些动态请求文件的存在，可以在文档头部显式声明它们：
```
<link rel="preload" href="gibberish.js">
```

### XHTML 中的变化

XHTML 虽然已经退出历史舞台，但实践中偶尔可能也会遇到遗留代码(page 16)

1、转义字符  
2、把所有代码都包含到一个 CDATA 块中（CDATA 块表示文档中可以包含任意文本的区块，其内容不作为标签来解析）
```
<![CDATA[ ]]>
```
在不支持 CDATA 块的非 XHTML 兼容浏览器中则不行。为此，CDATA 标记必须使用 JavaScript 注释来抵消: 

```
<script type="text/javascript"> 
//<![CDATA[ 
 function compare(a, b) {  } 
//]]> 
</script> 
```

注意 XHTML 模式会在页面的 MIME 类型被指定为"application/xhtml+xml"时触
发。并不是所有浏览器都支持以这种方式送达的 XHTML。

### 最佳做法
#### type 属性使用
原因：一个 MIME 类型字符串来标识script的内容，但 MIME 类型并没有跨浏览器标准化。  

结果：即使浏览器默认使用 JavaScript，在某些情况下某个无效或无法识别的 MIME 类型也可能导致浏览器跳过（不执行）相关代码。  

解决：除非使用 XHTML 或script标签要求、或包含非 JavaScript 代码，最佳做法是**不指定 type 属性。**

---
## 行内代码与外部文件

推荐使用外部文件的理由如下。
* 可维护性。JavaScript 代码如果分散到很多 HTML 页面，会导致维护困难。而用一个目录保存所有 JavaScript 文件，则更容易维护，这样开发者就可以独立于使用它们的 HTML 页面来编辑
代码。
* 缓存。浏览器会根据特定的设置缓存所有外部链接的 JavaScript 文件，这意味着如果两个页面都
用到同一个文件，则该文件只需下载一次。这最终意味着页面加载更快。
* 适应未来。通过把 JavaScript 放到外部文件中，就不必考虑用 XHTML 或前面提到的注释黑科技。  
包含外部 JavaScript 文件的语法在 HTML 和 XHTML 中是一样的。

**在 SPDY/HTTP2 中，预请求的消耗已显著降低，以轻量、独立 JavaScript 组件形式向客户端送达脚本更具优势。**  

---
## 文档模式

>准标准模式（almost standards mode）。这种模式下的浏览器支持很多标准的特性，但是没有标准规定得那么严格。主要区别在于如何对待图片元素周围的空白（在表格中使用图片时最明显）。  

**标准模式通过下列几种文档类型声明开启:**
```
<!-- HTML5 --> 
<!DOCTYPE html>
```
----
## &lt;noscript&gt;元素

* 浏览器不支持脚本；
* 浏览器对脚本的支持被关闭。  

任何一个条件被满足，包含在&lt;noscript&gt;中的内容就会被渲染。否则，浏览器不会渲染&lt;noscript&gt;中的内容。

## 小结

* 要包含外部 JavaScript 文件，必须将 src 属性设置为要包含文件的 URL。文件可以跟网页在同一台服务器上，也可以位于完全不同的域。

* 所有script元素会依照它们在网页中出现的次序被解释。在不使用 defer 和 async 属性的情况下，包含在&lt;script&gt;元素中的代码必须严格按次序解释。

* 对不推迟执行的脚本，浏览器必须解释完位于&lt;script&gt;元素中的代码，然后才能继续渲染页面的剩余部分。为此，**通常应该把&lt;script&gt;元素放到页面末尾，介于主内容之后及&lt;/body&gt;标签之前**。

* 可以使用 defer 属性把脚本推迟到文档渲染完毕后再执行。推迟的脚本原则上按照它们被列出的次序执行。

* 可以使用 async 属性表示脚本不需要等待其他脚本，同时也不阻塞文档渲染，即异步加载。异步脚本不能保证按照它们在页面中出现的次序执行。

* 通过使用&lt;noscript&gt;元素，可以指定在浏览器不支持脚本时显示的内容。如果浏览器支持并启用脚本，则&lt;noscript&gt;元素中的任何内容都不会被渲染。