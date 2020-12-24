---
order: 13
title: 变量提升
group:
    title: JS
    order: 1
---

# 变量提升

* 变量提升:在当前上下文中(全局/私有/块级)，JS代码自上而下执行之前，浏览器会提前处理一 些事情(可以理解为词法解析的一个环节，**词法解析**一定发生在代码执行之前)

* 会把**当前上下文中**所有带VAR/FUNCTION关键字的进行提前的声明或者定义

>带VAR的**只会**提前的声明  
>带FUNCTION会提前的**声明+定义**

```
声明declare: var a;
定义defined: a=10;
```

* 真实项目中建议用函数表达式创建函数，因为这样在变量提升阶段只会声明FUNC,不会赋值

```
func() // func is not a function (undefined)
var func = function () {
    console.log('OK');
}
```
# (匿名函数)具名化

* 把原本作为值的函数表达式匿名函数“具名化”
  + 起了名字，但是这个名字不能在外面访问
  + 因为不会在当前当下文中创建这个名字

```
func() // func is not a function (undefined)
var func = function AAA() {
    console.log('OK');
    console.log(AAA);// 存在的意义，像非严格模式下的argument.callee
}
AAA() // not defined 
```

* 存在的意义：当函数执行，在形成的私有上下文中，会把这个具名化的名字做为私有上下文中的变量(值就是这个函数)来进行处理

# GO

* 基于VAR或者FUNCTION在“全局上下文中声明的变量(全局变量)会“映射”到G0 (全局对象window)上一份，作为他的属性;而且接下来是一个修改， 另外一个也会跟着修改。

## EC(G):全局上下文中的变量提升

[老版本]
var a;
func=函数;

[新版本] 只声明不，定义
var a;
func;

* 不论条件是否成立， 都要进行变量提升
  + 细节点:条件中带FUNCTION的在新版本浏览器中，只提前声明，不会提前赋值

```
if (!("a' in window)) {// a被提升（声明），但未定义
    var a=1;
    function func(){}
}

console. log(a);// undefined
```


### 例题1

```
var foo = 1;

function bar() {
    // 私有foo变量提升 
    if (!foo) {// !undefined
      var foo = 10;
    }
    console.log(foo);// 10
}

bar();
```

* 在执行函数的时候，先进行变量提升。bar执行，首先提升foo
* 每次运行创建全新的私有上下文，最后bar()时，scope chain为<私有上下文，GO作用域>（因为全局创建的函数，右侧就是那里） 

* 因为scope chain，所以，foo有私有的，就去找私有的用。




