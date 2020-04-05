const include = (name, data) => {
    return apollo.renderTemplate(name, data)
}

if (global.templates == undefined) global.templates = {}

const apollo = {
    remove(name) {
        delete global.templates[name]
    },
    clear() {
        global.templates = {}
    },
    getAll() {
        return global.templates
    },
    get(name) {
        return global.templates[name] || null
    },
    set(name, html) {
        global.templates[name] = html
        return apollo
    },
    renderTemplate(name, data) {
        return apollo.render(apollo.get(name), data)
    },
    compileTemplate(name) {
        return apollo.compile(apollo.get(name))
    },
    compile(html) {
        return (data) => apollo.render(html, data)
    },
    render(html, data) {
        var name = [],
            value = [],
            re = /{{([^}}]*)?}}/g,
            reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
            code = 'var r=[];\n',
            cursor = 0,
            match
        Object.assign(data, {
            _: data,
            include
        })
        if (typeof (data) === "object")
            for (var k in data) {
                name.push(k)
                value.push(data[k])
            }
        var add = function (line, js) {
            if (/include\((.*?)\)/g.exec(line)) line = line.replace(/include\((.*?)\)/g, (t, c) => 'include(' + (c.split(',')[1] != undefined ? c : c) + ', _') + ')'
            js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '')
            return add
        }
        while (match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true)
            cursor = match.index + match[0].length
        }
        add(html.substr(cursor, html.length - cursor))
        code += 'return r.join("");'
        return new Function(name, code.replace(/[\r\t\n]/g, '')).apply(this, value)
    }
}

module.exports = apollo