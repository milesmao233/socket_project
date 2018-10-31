const Model = require('./main')

class User extends Model {
    constructor(form={}) {
        super(form)
        this.username = form.username || ''
        this.password = form.password || ''
        this.role = 2
    }

    validateRegister() {
        return this.username.length > 2 && this.password.length > 2
    }
}

module.exports = User