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

# 流控制语句

# 理解函数