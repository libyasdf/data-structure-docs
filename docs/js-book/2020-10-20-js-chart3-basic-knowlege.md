---
order: 3
title: 第三章 语言基础
group:
    title: 红宝书
    order: 1
---
# 语法
>区分大小写  
标识符，就是变量、函数、属性或函数参数的名称  
驼峰命名  
* 第一个字符必须是一个字母、下划线（_）或美元符号（$）
* 剩下的其他字符可以是字母、下划线、美元符号或数字  

note:标识符中的字母可以是扩展 ASCII（Extended ASCII）中的字母，也可以是 Unicode 的字母字符，如 À 和 Æ (**但不推荐使用**)。

# 数据类型

## string

>\xnn 以十六进制编码 nn 表示的字符（其中 n 是十六进制数字 0~F），例如\x41 等于"A"  
\unnnn 以十六进制编码 nnnn 表示的 Unicode 字符（其中 n 是十六进制数字 0~F），例如\u03a3 等于希腊字
符"Σ"

```
let text = "This is the letter sigma: \u03a3.";
```
### 模版字面量

*模版字面量会计算里面的空格、换行，可以被「.length」和「 === '\n'」*

```
将表达式转换为字符串时会调用 toString()：

let foo = { toString: () => 'World' }; 
console.log(`Hello, ${ foo }!`); // Hello, World!
```

可以直接调用函数方法：
```
function zipTag(strings, ...expressions) { 
 // log strings [ '', ' + ', ' = ', '' ]
 // log expressions [ 6, 9, 15 ]

 return strings[0] + 
 expressions.map((e, i) => `${e}${strings[i + 1]}`) 
 .join(''); 
} 

let taggedResult = zipTag`${ a } + ${ b } = ${ a + b }`;
```

### String.raw``
保留原始字符串
```
function printRaw(strings) { 
    // strings [\u00A9, \n]

 for (const string of strings) { 
     // 真实的符号
 console.log(string); 
 } 

 for (const rawString of strings.raw) { 
    // 原本的样子 
 console.log(rawString); 
 } 
}

printRaw`\u00A9${ 'and' }\n`;
```

### Symbol

`Object.getOwnPropertyNames()`不返回不可枚举的symbol，所以使用`Object.getOwnPropertySymbols()`来返回。

`Object.getOwnPropertyDescriptors()`会返回同时包含常规和符号属性描述符的对象。

键值混着symbol和string的，`Reflect.ownKeys(o)`可以将他们都返回来。

```
let o = { 
 [Symbol('foo')]: 'foo val', 
 [Symbol('bar')]: 'bar val', 
 baz: 'baz val', 
 qux: 'qux val' 
}; 

console.log(Object.getOwnPropertySymbols(o)); 
// [Symbol(foo), Symbol(bar)] 
console.log(Object.getOwnPropertyNames(o)); 
// ["baz", "qux"] 
console.log(Object.getOwnPropertyDescriptors(o)); 
// {baz: {...}, qux: {...}, Symbol(foo): {...}, Symbol(bar): {...}} 
console.log(Reflect.ownKeys(o)); 
// ["baz", "qux", Symbol(foo), Symbol(bar)]
```

# 流控制语句

# 理解函数