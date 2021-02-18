---
order: 1
title: hbs
group:
    title: basic
    order: 1
---

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

