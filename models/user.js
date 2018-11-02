const Model = require('./main')

class User extends Model {
    constructor(form={}) {
        super(form)
        this.username = form.username || ''
        this.password = form.password || ''
        this.role = 2
    }

    static validateLogin(form) {
        const {username, password} = form
        const u = this.findBy('username', username)
        return u !== null && u.password === password
    }

    static update(form) {
        const userId = Number(form.id || -1)
        const u = this.findBy('id', userId)
        u.password = form.password
        u.save()
    }

    static guest() {
        const o = {
            id: -1,
            username: '游客',
        }
        const u = this.create(o)
        return u
    }

    static validateRegister(form) {
        const {username, password} = form
        const validUsername = username.length > 2
        const validPassword = password.length > 2
        const uniqueUsername = User.findBy('username', username) === null
        return validUsername && validPassword && uniqueUsername
    }
}

module.exports = User