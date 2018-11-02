const {log, template} = require('./utils')
const fs = require('fs')
const User = require('./models/user')

// const session = {}

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

const randomString = () => {
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
    const sessionId = request.cookies.sessionId
    if (sessionId !== undefined) {
        const s = Session.findBy('sessionId', sessionId)
        if (s !== null && !s.expired()) {
            const uid = s.userId
            const u = User.get(uid)
            return u
        } else {
            return User.guest()
        }
    } else {
        return User.guest()
    }
}


const redirect = (url) => {
    const headers = {
        'Location': url,
    }
    const r = headerFromMapper(headers, 302) + '\r\n'
    return r
}

const htmlResponse = (body, headers=null) => {
    const h = {
        'Content-Type': 'text/html',
    }
    headers = Object.assign(h, headers)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
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

const index = () => {
    const body = template('index.html')
    return htmlResponse(body)
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
        '/admin/users': loginRequired(adminRequired(adminUser)),
        '/admin/user/update':adminRequired(adminuserUpdate),
    }

    return d
}


module.exports = {
    routeMapper: routeMapper,
    error: error,
    headerFromMapper: headerFromMapper,
    redirect: redirect,
    currentUser: currentUser,
    loginRequired: loginRequired,
    htmlResponse: htmlResponse,
    randomString: randomString,
}
