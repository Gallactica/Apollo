# Apollo
NodeJS Шаблонизатор HTML

```js
const apollo = require('./index.js')
```

--------------------
## Пример
> hello.html
```html
<h1>Привет {{title}}</h1>
```
> index.js
```js
const apollo = require('./index.js')
const template = require('fs').readFileSync('./hello.html', 'utf-8')

const result = apollo.render(template, {
    title: "Галактика"
})

 console.log(result)
```

--------------------
## Установка шаблона
```js
apollo.set(name, html)
```
## Получение шаблона
```js
apollo.get(name)
```
## Получение всех шаблонов
```js
apollo.getAll()
```
## Удаление шаблона
```js
apollo.remove(name)
```
## Очистка шаблонов
```js
apollo.clear()
```
## Рендер HTML
```js
apollo.render(html, data)
```
## Рендер шаблона
```js
apollo.renderTemplate(name, data)
```
## Компиляция HTML
```js
const result = apollo.compile(html)
result(data)
```
## Компиляция шаблона
```js
const result = apollo.compileTemplate(name)
result(data)
```