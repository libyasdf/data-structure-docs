---
order: 12
title: let var const 区别 变量提升
group:
    title: JS
    order: 1
---
### 例题（复习）

[关系图](20201206/4.png)   

```
let a=0,
    b=0;
function A(a){
    A=function(b){
        alert(a+b++);
    };
    alert(a++);
}
A(1);
A(2);
```

* 作用域链，指向的是函数执行的上下文，而不是创建函数的heap。

# let&const VS var&function 区别 

+ 声明变量(设定一个名字，让其关联存储一个具体的值)  
+  声明常量(具体值)，const也是声明变量的，只不过不能修改此变量的关联指向  

## 变量提升

* 变量提升：把当前上下文中所有带var/function关键字的进行提前的声明或者定义(var->声明 function->声明+定义)
```
console.log(n); //->undefined
var n = 10;
```

* var存在变量提升的，但是let不存在  
```
console.log(n); //->Uncaught ReferenceError: Cannot access 'n' before initialization
let n = 10;
```

## 重复声明

+ 相同上下文中，var允许重复声明「只识别一次」；
+ let不允许重复声明（不论基于啥声明过，再基于let/const声明都会报错）；

```
var n = 10;
var n = 20;
console.log(n); // 20 

// Uncaught SyntaxError: Identifier 'n' has already been declared  
// 在词法解析阶段，如果报错，则所有代码都不执行
console.log('OK');
let n = 10;
let n = 20;
console.log(n);
```

#### 词法解析过程：
+ 从服务器获取JS代码`<script src='x.js'>`
+ 二进制流
+ 字符串
+ ECMAScript Token令牌「词法解析 AST语法树」

#### 在“全局上下文中”，基于var/let声明的变量，和GO(window)的关系是不一样的

```
/* 
 * EC(G)
 *  VO(G) 全局变量对象
 *    n -> 10
 */
var n = 10;
console.log(n); //->10
console.log(window.n); //->10
window.n = 20;
console.log(n); //->20
```
* 基于var/function声明的变量：
  + 除了往全局变量对象中存储一份，而且也给GO(window)设置了对应的属性 「映射机制」（**新版处理机制**：在全局上下文中，基于var/function声明的变量，**直接存储到GO中**（VO(G)中不留了））
  + GO->{..., n:10 }

```
n = 10; //->GO:{n:10} 设置：直接给GO设置
console.log(n); //->先看VO(G)中有没有，如果有就是全局变量的操作，如果没有，再看GO中有没有...如果还没有，则报错：变量未定义
``` 

### 基于let/const声明的变量，只会存储到VO(G)中，和GO没有任何的关系

```
let n = 10; //存入->VO(G)  n->10
console.log(n); //=>10
console.log(window.n); //GO中没有放，所以=>undefined
```

## JS中的暂时性死区

* 基于typeof检测一个未被声明的变量，不会报错，结果是'undefined'
```
console.log(typeof n); //->'undefined'
```

* let的机制抵消了暂时性死区的机制
```
console.log(typeof n); 
//Uncaught ReferenceError: Cannot access 'n' before initialization 

let n = 10;
```

## let会产生“块级作用域（私有的上下文）”

* 全局上下文、函数执行的私有上下文、块级私有上下文
+ 除函数体以及创建对象的大括号外，其余大部分包含代码块的大括号（例如：判断体、循环体...）都有可能会产生**块级上下文**

```
{    
    var n = 10; //全局的n
    let m = 20; //块级私有的
    console.log(n, m); //->10, 20
}
console.log(n); //->10
console.log(m); //->Uncaught ReferenceError: m is not defined
```

* 在代码块中，首先看是否出现 **let/const/function「特殊」**，如果出现，此时就会形成一个块级私有上下文   

EC(BLOCK)  
VO(BLOCK): m->20  
作用域链:`<EC(BLOCK),EC(G)>` 上级上下文就是代码执行所处的环境  
 ->没有自己的THIS，用到的this用的也都是上级上下文中的  
 ->没有arguments  
 ->没有形参赋值  
 ->有变量提升，也只是针对特殊的function

>即使产生块级上下文，**对var的操作也是无效**的，「var不受块级上下文的影响」。