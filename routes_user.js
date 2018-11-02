const Session = require('./models/session')
const User = require('./models/user')
const {
    headerFromMapper,
    redirect,
    randomString,
    currentUser,
    htmlResponse,
} = require('./routes')

const {log, template} = require('./utils')

const loginView = (request) => {
    const u = currentUser(request)
    const body = template('login.html', {
        username: u.username,
    })
    return htmlResponse(body)
}

const login = (request) => {
    let u = null

    const form = request.form()
    if (User.validateLogin(form)) {
        u = User.findBy('username', form.username)
        const s = Session.encrypt({
            uid: u.id,
        })
        log('session:', s)
        const headers = {
            'Set-Cookie': `session=${s}; Path=/`
        }
        return redirect('/', headers)
    } else {
        const result = '登录失败'
        const body = template('login.html', {
            result: result
        })
        return htmlResponse(body)
    }
}

const registerView = (request) => {
    const body = template('register.html')
    return htmlResponse(body)
}

const register = (request) => {
    let result = ''
    let us = []
    const form = request.form()
    if (User.validateRegister(form)) {
        User.create(form)
        us = User.all()
        result = '注册成功'
    } else {
        result = '用户名或者密码长度必须大于2'
    }

    const body = template('register.html', {
        result: result,
        us: us,
    })
    return htmlResponse(body)
}

const routeMapper = () => {
    const d = {
        '/login': loginView,
        '/user/login': login,
        '/register': registerView,
        '/user/register': register,
    }
    return d
}

module.exports = routeMapper