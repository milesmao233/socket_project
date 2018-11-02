const Model = require('./main')
const Comment = require('./comment')
const User = require('./user')

class Weibo extends Model {
    constructor(form={}, userId=-1) {
        super(form);
        this.content = form.content || ''
        this.userId = Number('userId' in form ? form.userId : userId)
    }

    user() {
        const u = User.get(this.userId)
        return u
    }

}

module.exports = Weibo