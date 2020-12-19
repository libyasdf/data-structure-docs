---
order: 12
title: let var const 区别
group:
    title: JS
    order: 1
---
### 例题
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