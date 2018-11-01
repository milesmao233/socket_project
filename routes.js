const log = require('./utils')
const fs = require('fs')
const User = require('./models/user')

const session = {}

const error = () => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND0\r\n\r\n<h1>NOT FOUND</h1>',
    }
    const r = e[404] || ''
    return r
}

const headerFromMapper = (mapper={}, code=200) => {
    let base = `HTTP/1.1 ${code} OK \r\n`
    const s = Object.keys(mapper).map(k => `${k}: ${mapper[k]}\r\n`).join('')
    const header = base + s
    return header
}

const randomStr = () => {
    const seed = 'asdfghjokpwefdsui3456789dfghjk67wsdcfvgbnmkcvb2e'
    let s = ''
    for (let i = 0; i < 16; i++) {
        const random = Math.random() * seed.length
        const index = Math.floor(random)
        s += seed[index]
    }
    return s
}

const currentUsername = (request) => {
    const sid = request.cookies.user || ''
    const uid = session[sid]
    const u = User.findBy('id', uid)
    if (u !== null) {
        return u.username
    }
    return u
}

const currentUser = (request) => {
    const sid = request.cookies.user || ''
    const uid = session[sid]
    const u = User.findBy('id', uid)
    return u
}

const template = (name) => {
    const path = 'templates/' + name
    const options = {
        encoding: 'utf8'
    }
    const content = fs.readFileSync(path, options)
    return content
}

const redirect = (url) => {
    const headers = {
        'Location': url,
    }
    const r = headerFromMapper(headers, 302) + '\r\n'
    return r
}

const loginRequired = (func) => {
    const f = (request) => {
        const u = currentUser(request)
        if (u === null) {
            return redirect('/login')
        } else {
            return func(request)
        }
    }
    return f
}

const adminRequired = (func) => {
    const f = (request) => {
        const u = currentUser(request)
        log('u', u)
        if (u === null || u.role !== 1) {
            return redirect('/login')
        } else {
            return func(request)
        }
    }
    return f
}

const index = (request) => {
    const headers = {
        'Content-Type': 'text/html'
    }
    const header = headerFromMapper(headers)
    let body = template('index.html')

    const r = header + '\r\n' + body
    return r
}

const login = (request) => {
    const headers = {
        'Content-Type': 'text/html'
    }
    let result
    if (request.method === 'POST') {
        const form = request.form()
        if (User.validateLogin(form)) {
            const u = User.findBy('username', form.username)
            // 创建session_id
            const sid = randomStr()
            session[sid] = u.id
            // log('session', session)
            headers['Set-Cookie'] = `user=${sid}`
            result = '登录成功'
        } else {
            result = '用户名或密码错误'
        }
    } else {
        result = ''
    }
    const username = currentUsername(request)
    const header = headerFromMapper(headers)
    let body = template('login.html')
    body = body.replace('{{result}}', result)
    body = body.replace('{{username}}', username)
    const r = header + '\r\n' + body
    return r
}

const register = (request) => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        if (u.validateRegister()) {
            u.save()
            const us = User.all()
            result = `注册成功<br><pre>${us}</pre>`
        } else {
            result = '用户名或者密码长度大于2'
        }
    } else {
        result = ''
    }
    const headers = {
        'Content-Type': 'text/html'
    }
    const header = headerFromMapper(headers)
    let body = template('register.html')
    body = body.replace('{{result}}', result)

    const r = header + '\r\n' + body
    return r
}


const adminUser = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    let body = template('admin.html')
    const users = User.all()
    body = body.replace('{{users}}', users)
    const r = header + '\r\n' + body
    return r
}

const adminuserUpdate = (request) => {
    const form = request.form()
    User.update(form)
    return redirect('/admin/users')
}


const routeMapper = () => {
    const d = {
        '/': index,
        '/login': login,
        '/register': register,
        '/admin/users': loginRequired(adminRequired(adminUser)),
        '/admin/user/update':adminRequired(adminuserUpdate),
    }

    return d
}


module.exports = {
    routeMapper: routeMapper,
    error: error,
    template: template,
    headerFromMapper: headerFromMapper,
    redirect: redirect,
    currentUser: currentUser,
    loginRequired: loginRequired,
}
