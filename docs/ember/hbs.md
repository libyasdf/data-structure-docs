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

### 自定义

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

Handlebars 不会转义 Handlebars.SafeString

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

* Handlebars 不会转义 JavaScript 字串。使用 Handlebars 生成 JavaScript（例如内联事件处理程序），可能会产生跨域脚本攻击漏洞。

### 共享模版

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

