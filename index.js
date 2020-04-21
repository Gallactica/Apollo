const Apollo = require('./apollo.js')

Apollo.render("hello.html", {
    title: "Галактика",
    count: [1, 2, 3, 4, 5]
}).then(html => console.log(html))