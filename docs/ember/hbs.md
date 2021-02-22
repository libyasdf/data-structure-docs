---
order: 1
title: hbs
group:
    title: basic
    order: 1
---

# 介绍

### object

```hbs
{{#with person}}
{{firstname}} {{lastname}}
{{/with}}
<!-- Yehuda Katz -->
```

```js
{
  person: {
    firstname: "Yehuda",
    lastname: "Katz",
  },
}
```

### Array

```hbs
<ul class="people_list">
  {{#each people}}
    <li>{{this}}</li>
  {{/each}}
</ul>
<!-- 
<ul class="people_list">
    <li>Yehuda Katz</li>
    <li>Alan Johnson</li>
    <li>Charles Jolley</li>
</ul> 
-->
```

```js
{
  people: [
    "Yehuda Katz",
    "Alan Johnson",
    "Charles Jolley",
  ],
}
```

### 自定义(助手代码)

* 助手代码可以实现一些并非 Handlesbars 语言本身的功能
* Handlebars 助手代码的**调用**需要一个简单标识符，且可紧接一个或多个参数（**以空格分割**）。每一参数为一个 Handlebars 表达式，且 将会用于上方“基本用法”中相同的方法来计算。

```hbs
{{#each people}}
   {{print_person}}
{{/each}}
```
```js
Handlebars.registerHelper('print_person', function () {
    return this.firstname + ' ' + this.lastname
})
```
```js
{
  people: [
    {
      firstname: "Nils",
      lastname: "Knappmeier",
    },
    {
      firstname: "Yehuda",
      lastname: "Katz",
    },
  ],
}
```

### Block Helper

```hbs
{{#list people}}{{firstname}} {{lastname}}{{/list}}
<!-- 
<ul>
<li>Yehuda Katz</li>
<li>Carl Lerche</li>
<li>Alan Johnson</li>
</ul> 
-->
```

```js
Handlebars.registerHelper("list", function(items, options) {
  const itemsAsHtml = items.map(item => "<li>" + options.fn(item) + "</li>");
  return "<ul>\n" + itemsAsHtml.join("\n") + "\n</ul>";
});
```

```js
{
  people: [
    {
      firstname: "Yehuda",
      lastname: "Katz",
    },
    {
      firstname: "Carl",
      lastname: "Lerche",
    },
    {
      firstname: "Alan",
      lastname: "Johnson",
    },
  ],
}
```

### ember 中的Handlebars.registerHelper()

```js
Ember.Handlebars.registerHelper()
```

### HTML转译

* `{{ }}` 返回的值是 HTML 转义的
  + 如果一个表达式包含 &，那么返回的 HTML 转义的内 容将会包含 &amp;
* 不想让 Handlebars 转义某个值使用`{{{}}}`

```hbs
raw: {{{specialChars}}}
html-escaped: {{specialChars}}
<!-- 
raw: & < > " ' ` =
html-escaped: &amp; &lt; &gt; &quot; &#x27; &#x60; &#x3D;
 -->
```

```js
{ specialChars: "& < > \" ' ` =" }
```

## 避免助手代码的返回值被 HTML 转义

* Handlebars 不会转义 `Handlebars.SafeString`

```hbs
{{bold text}}
<!-- <b>Isn&#x27;t this great?</b> -->
```


```js
{ text: "Isn't this great?" }
// 
Handlebars.registerHelper("bold", function(text) {
  var result = "<b>" + Handlebars.escapeExpression(text) + "</b>";
  return new Handlebars.SafeString(result);
});
```
* 即使当使用 {{ 而非 {{{ 来调用助手代码时，当你的助手代码返回一个 `Handlebars.Safestring` 的实例，返回值也并不会被转义 。你需要留心将所有参数正确地使用 `Handlebars.escapeExpression` 来转义

* Handlebars 不会转义 JavaScript 字串。使用 Handlebars 生成 JavaScript（例如内联事件处理程序），可能会产生跨域脚本攻击漏洞。

### 具有多个参数的助手代码

```hbs
{{link "See Website" url}}
<!-- { url: "https://yehudakatz.com/" } -->
```

```js
Handlebars.registerHelper("link", function(text, url) {
      var url = Handlebars.escapeExpression(url),
          text = Handlebars.escapeExpression(text)
          
     return new Handlebars.SafeString("<a href='" + url + "'>" + text +"</a>");
});
// 输出 <a href='https://yehudakatz.com/'>See Website</a>
```

## 字面量参数

* true false null undefined 

```hbs
{{progress "Search" 10 false}}
{{progress "Upload" 90 true}}
{{progress "Finish" 100 false}}
```

```js
Handlebars.registerHelper('progress', function (name, percent, stalled) {
  var barWidth = percent / 5
  var bar = "********************".slice(0,barWidth)            
  return bar + " " + percent + "% " + name + " " +  (stalled ? "stalled" : "")
})
// ** 10% Search 
// ****************** 90% Upload stalled
// ******************** 100% Finish 
```

## 含有 Hash 参数的助手代码

```js
{{link "See Website" href=person.url class="person"}}
```

* 最后一个参数 href=people.url class="people" 为传送至助手代码的 Hash 参数
* Hash 参数可以从最后一个参数 options 获取
```js
Handlebars.registerHelper("link", function(text, options) {
    var attributes = [];

    Object.keys(options.hash).forEach(key => {
        var escapedKey = Handlebars.escapeExpression(key);
        var escapedValue = Handlebars.escapeExpression(options.hash[key]);
        attributes.push(escapedKey + '="' + escapedValue + '"');
    })
    var escapedText = Handlebars.escapeExpression(text);
    
    var escapedOutput ="<a " + attributes.join(" ") + ">" + escapedText + "</a>";
    return new Handlebars.SafeString(escapedOutput);
    // <a class="person" href="https://yehudakatz.com/">See Website</a>
});
```

```js
{
  person: {
    firstname: "Yehuda",
    lastname: "Katz",
    url: "https://yehudakatz.com/",
  },
}
```

## 奇异
+ 如果助手代码注册时的名称和一个输入的**属性名**重复，则助手代码的优先级更高。如果你想使用输入的属性，请在其名称前加 `./` 或 `this.`。（或是已弃用的 `this/`。）

```hbs
helper: {{name}}
data: {{./name}} or {{this/name}} or {{this.name}}
<!-- { name: "Yehuda" } -->
```

```js
Handlebars.registerHelper('name', function () {
    return "Nils"
})
// helper: Nils
// data: Yehuda or Yehuda or Yehuda
```

## 子级表达式

* 将内部助手代码调用的返回值作为 外部助手代码的参数传递。子级表达式使用括号定界。

```hbs
{{outer-helper (inner-helper 'abc') 'def'}}
```

## 空格控制

* 在括号中添加一个 ~ 字符，可以从任何 Mustache 模板代码块的任何一侧省略模板中的空格。应用后，该侧的所有空格将被删除，直到第一个位于同一侧的 Handlebars 表达式或非空格字符出现。

效果:

```html
<a href="foo">bar</a><a href="bar">Empty</a>
```

```hbs
{{#each nav ~}}
  <a href="{{url}}">
    {{~#if test}}
      {{~title}}
    {{~^~}}
      Empty
    {{~/if~}}
  </a>
{{~/each}}
```

```js
{
  nav: [{ url: "foo", test: true, title: "bar" }, { url: "bar" }];
}
```

## 转义 Handlebars 表达式

* 两种转义：「内联转义」或「RAW 块助手代码」。
  + 内联转义通过 Mustache 代码块前置 `\` 实现 
  + RAW 代码块通过使用 `{{{{` 实现——与块助手代码均相同，但区别在于它的子内容被 Handlebars 视为一段字符串。

## 共享模版

```hbs
{{#each persons}}
  {{>person person=.}}
{{/each}}
<!-- 
  Nils is 20 years old.
  Teddy is 10 years old.
  Nelson is 40 years old.
   -->
```

```js
{
  persons: [
    { name: "Nils", age: 20 },
    { name: "Teddy", age: 10 },
    { name: "Nelson", age: 40 },
  ],
}

Handlebars.registerPartial(
    "person", 
    "{{person.name}} is {{person.age}} years old.\n"
)
```

### Partials 代码片段

* Handlebars 允许代码片段的复用。代码片段是一段普通的 Handlebars 模板，但它们可以直接由其他模板调用。
* 必须通过 `Handlebars.registerPartial` 注册。

```hbs
{{> myPartial}}
<!-- Hello -->
```

```js
Handlebars.registerPartial('myPartial', '{{prefix}}');
// { prefix: "Hello" }
```

### 动态代码片段

```hbs
{{> (whichPartial) }}
```
* 子表达式不会解析变量，因此 whichPartial 必须是一个函数

```hbs
{{> (lookup . 'myVariable') }}
<!-- { myVariable: "lookupMyPartial" } -->
```

# 表达式

### 转回父级上下文

```hbs
{{#each people}}
    {{../prefix}} {{firstname}} 
{{/each}}
```

```js
{
  people: [
    { firstname: "Nils" },
    { firstname: "Yehuda" },
  ],
  prefix: "Hello",
}
```

### 文字

```js
{
  array: [
    {
      item: "item1", // {{array.[0].item}}
      "item-class": "class1",// {{array.[0].[item-class]}}
    },
  ],
  true: "yes",// {{./[true]}}
}
```

* 除了以下字符，标识符可以是任何 Unicode 文本：
  + Whitespace ! " # % & ' ( ) * + , . / ; < = > @ [ \ ] ^ ` { | } ~

* true, false, null 和 undefined 只允许在路径表达式的开头出现。

* 引用一个并非合法的标识符，你可以使用 [。在路径表达式中你不必使用 ] 来关闭它，但其他表达式中是需要的。

* JavaScript 样式的字符串如 " 和 ' 也可用于替代 [。



