const isBrowser = typeof window != 'undefined'

function getFileBrowser(path) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.open("GET", path, true)
        xhr.onload = e => (xhr.readyState === 4 && xhr.status === 200) ? resolve(xhr.responseText) : reject(xhr.statusText)
        xhr.send()
    })
}

function getFileNode(path) {
    return require('fs').promises.readFile(path, 'utf-8')
}

const Apollo = {
    isBrowser,
    cache: false,
    returnElement: true,
    templates: {
        _data: {},
        set: function (key, val) {
            this._data[key] = val
        },
        get: function (key) {
            return this._data[key]
        },
        exists(key) {
            return this._data[key] != undefined
        },
        remove: function (key) {
            delete this._data[key]
        },
        reset: function () {
            this._data = {}
        }
    },
    requestPath(name) {
        return name
    },
    renderResult(html) {
        if (isBrowser == true && Apollo.returnElement == true) {
            const div = document.createElement('div')
            div.innerHTML = html
            return div.children.length > 1 ? div.children : div.children[0]
        }
        return html
    },
    async requestTemplate(name) {
        if (Apollo.cache == true && Apollo.templates.exists(name) == true) return Apollo.templates.get(name)
        const path = Apollo.requestPath(name)
        const template = isBrowser ? await getFileBrowser(path) : await getFileNode(path)
        Apollo.templates.set(name, template)
        return template
    },
    async render(template, data) {
        const html = await Apollo.requestTemplate(template)

        var name = [],
            value = [],
            re = /\{\{(.+?)\}\}/g,
            reExp = /(^( )?(if|for|.+?\.forEach|else|switch|case|break|{{}))(.*)?/g,
            code = 'return new Promise(async (resolve, reject) => {var r=[];',
            cursor = 0,
            match

        Object.assign(data, {
            local: data,
            include: Apollo.render,
            isBrowser
        })

        if (typeof (data) === "object")
            for (var k in data) {
                name.push(k)
                value.push(data[k])
            }

        var add = function (line, js) {
            if (/include\((.*?)\)/g.exec(line)) line = line.replace(/include\((.*?)\)/g, (t, c) => 'await include(' + (c.split(',')[1] != undefined ? c : c) + ',local') + ')'

            if (js) {
                if (line.match(reExp)) {
                    code += line + (!line.endsWith(';') ? ';' : '') + '\n'
                } else {
                    code += 'r.push(' + line + ');\n'
                }
            } else {
                if (line.trim() == '') return add
                code += 'r.push(`' + line.replace(/"/g, '\\"') + '`);'
            }

            return add
        }

        while (match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true)
            cursor = match.index + match[0].length
        }

        add(html.substr(cursor, html.length - cursor))
        code += 'resolve(r.join(""));})'

        const result = await new Function(name, code).apply(this, value)

        return Apollo.renderResult(result.split('\n').filter(value => value.trim() != "").join('\n'))
    }
}

if (!isBrowser) module.exports = Apollo