# Apollo
NodeJS/Browser Async HTML Шаблонизатор

### Node.JS
```js
const apollo = require('./apollo.js')
```
### Браузер
```html
<script src="https://gallactica.github.io/Apollo/apollo.js"></script>
```

--------------------
## Пример
##### hello.html

```html
<h1>Привет {{title}}</h1>
```
##### index.js

```js
// Строка ниже только для Node.JS
const Apollo = require('./apollo.js')

Apollo.render("hello.html", {
    title: "Галактика"
}).then(html => console.log(html))
```

##### Шаблонизация
Внутри параметра имеет
```
local: Текущие параметры
isBrowser: Флаг текущего окружения 
include: (name, data) Рендер других шаблонов в текущем
// Наш заданный параметр
title: "Галактика" 
```

--------------------
## Использование
### Вложенность
##### template.html
Текущие параметры передаются другому шаблону
```js
render("template.html", { name: "Галактика" })
```
```html
<h1>{{name}}</h1> 		 <!-- <h1>Галактика</h1> -->
{{ include("item.html") }} <!-- <h3>Галактика</h3> -->
```
##### item.html
```html
<h3>{{name}}</h3> <!-- <h3>Галактика</h3> -->
```

### Параметры
Кэширование шаблонов. 
>По умолчанию стоит `false`

```js
Apollo.cache = true || false
```
Возвращение элемента или массива элементов (в браузере).
>По умолчанию стоит `true`

```js
Apollo.returnElement = true || false
```
Управление кэшированными шаблонами
```js
// Получить шаблон
Apollo.templates.get(name)
// Установить шаблон
Apollo.templates.get(name, html)
// Существование шаблона
Apollo.templates.exists(name)
// Удалить шаблон
Apollo.templates.remove(name)
// Сбросить все шаблоны
Apollo.templates.reset()
```
Флаг браузера возвращает `true` или `false`
```js
Apollo.isBrowser 
```
### Рендер
```js
// name: Название шаблона
// data: Объект с информацией
Apollo.render(name, data)
	.then(html => {})
```
### Запрос шаблона
Запрашивает путь шаблона перед запросом
```js
// name: Название шаблона
Apollo.requestTemplate(name)
	.then(html => {})
```
### Путь шаблона
Можно изменить для собственных путей шаблонов
```js
// name: Название шаблона
// input.html => input.html
Apollo.requestPath(name)
// input => input.html
Apollo.requestPath = (name) => name + '.html'
```