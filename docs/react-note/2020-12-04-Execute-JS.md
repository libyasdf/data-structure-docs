---
order: 10
title: JS执行
group:
    title: JS
    order: 1
---

# JS运行的环境
+ 浏览器
+ webview  WebApp(Hybride混合APP) 
+ node.js

* 浏览器能够运行JS代码，是因为提供了代码运行的环境：栈内存（Stack）  
    + 栈内存也是从计算机的内存分配出来的一块内存
    + 执行环境栈 **E（execution）C（context）Stack**
    
* 执行代码的过程中，为了区分是在哪个环境下执行（全局/函数/块...），首先会产生一个执行上下文：**EC**
    + EC(G) 全局上下文，全局代码在这执行
    + EC(X) 某个函数的执行上下文

```
var a = 12;
var b = a;
b = 13;
console.log(a);
```
[等号赋值经历三个步骤](20201204/1.png)  
1. 创建值
1. 声明变量
1. 赋值

# Heap
提供一个16进制得地址，存放在stack中，供调用。

```
var a = {
    n: 12
}; //a -> 0x0001

var b = a;
b = { // 开辟一个heap
    n: 13
}; //b -> 0x0002
console.log(a.n); // 12
```

[堆与栈](20201204/2.png)   

#### 思考：

```
var a = {
    n: 1
};
var b = a;
a.x = a = {
    // 先创建了{n: 2}的heap，让a地址中的X存储该heap地址；然后a地址被改为了该heap地址。
    n: 2
};
console.log(a.x);
console.log(b);
```

* a.x 成员访问，优先级20「优先计算的」
  + a.x=a=?  先处理a.x=?
  + a=a.x=?  先处理a.x=?
**都是先算「.」运算符**

```
var a = 12,
    b = 12;
// var a=12;  var b=12;
```

* `var a = b = 12`var a;  b没有var
 + 1.创建值12
 + 2.连等操作是按照从右到左
    先b -> 12，然后a -> 12

[运算符优先级](https://developer.mozilla.org/zh-CN/docs/web/javascript/reference/operators/operator_precedence)  