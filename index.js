const Apollo = require('./apollo.js')

Apollo.render("hello.html", {
    title: "Галактика"
}).then(html => console.log(html))