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

    validateRegister() {
        return this.username.length > 2 && this.password.length > 2
    }
}

module.exports = User