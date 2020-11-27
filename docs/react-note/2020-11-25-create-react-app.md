---
order: 6
title: create-react-app
group:
    title: React vue
    order: 1
---

# vue的MVVM

### model层
```
export default {
    data() {
        return {
            text: 'hello world!'
        }
    }
}
```

### view层
```
<template>
    <span>{{text}}</span>
</template>
```

### viewModel层
vue本身就是vm层
```
mounted(){
    /* vue 内置实现的ViewModel层 */
    /* 能够监听数据的改变 proxy 数据的劫持 */
    setTimeout(_=>{
        this.text = 'teacher urly'
    },20000)
    /* 数据改变影响视图 MVVM中的第一层*/
}
```

### 双向数据绑定

# react的MVC

### view视图层
react基于jsx创建视图层，vue基于template创建视图层（后期vue增加了jsx语法）。
```
render(){
    return <div>{this.state.text}</div>
}
```

### model数据层

```
constructor(){
    super(){

    }

    this.state = {
        text = 'zhufeng'
    }
}
```
### 数据影响视图（单向数据绑定）
```
componentDidMount(){
    /* 通过修改数据实现视图的重新渲染 */
    this.setState = ({
        text = 'teacher urly'
    })
}
```

# 比较
1、都是操作数据来影响视图，告别传统DOM时代
>model层控制view层  

vue基于数据劫持，拦截到最新的数据，从而重新渲染视图。

react则提供对应的API，通过我们操作API，让最新数据渲染视图。

2、Dom 差异化渲染——dom diff

>每一次数据更改，都把需要改变的视图部分进行重新渲染

3、react单向数据绑定，vue基于v-model实现双向数据绑定（多出来了：视图也可以影响数据）

>在视图影响数据的方式上，两者都是基于change/input事件，监听表单元素内容的改变，从而去修改数据，达到数据的更新。

# 其它
**vue只是v+vm层，react只是v层**

# 脚手架

官方脚手架 create-react-app

守望先锋 DvaJS 

阿里 UmiJS

### 在全局安装脚手架
```
npm i -g create-react-app
create-react-app liby-react-project
```
默认安装了
- react
- react-dom(开发html页面)
- react-native(开发手机端)
- react-scripts 


```
sudo npm install yarn -g
// mac 加 sudo
```


>对于隐藏的配置项

在vue中使用vue.config.js进行覆盖配置（链式写法）  
react中`npm run eject`或`yarn eject`   
在放开eject之前，的错误提示，解决方式：
```
git add .
git commit -am “Save before ejecting”
```
设置环境变量
```
Windows
"start": "set PORT=8080&node scripts/start.js",

Mac
"start": "PORT=8080 node scripts/start.js",
```
改变端口值

# index.html

1. 默认情况下，所有资源和和编写的模块都会放到src下。webpack本身就是打包src目录，根据index.js的依赖打包在一起。

1. 但有些东西还是写在index.html中。  
#### 首页白屏 
- （可以将loading放在index.html中）
- 资源做304缓存

#### 有些不支持（commonJS/ESModule）规范，无法import的模块
- 在html中，用script导入进来
- 直接放公共资源（就会脱离webpack打包，不会被打包在一起）  

### 配置向后兼容

IE6 7 8，react vue完全不兼容。

IE10 11
vue
- browsersList  
|- [github browserslist](https://github.com/browserslist/browserslist)  
|- [浏览器版本覆盖率](https://browserl.ist)  
- Polyfill (可以import进来，也可以在webpack里面配)
|- 兼容es7语法
|- react-app-polyfill
