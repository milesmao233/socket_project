const Model = require('./main')
const Comment = require('./comment')
const User = require('./user')

class Weibo extends Model {
    constructor(form={}, userId=-1) {
        super(form);
        this.content = form.content || ''
        this.userId = Number('userId' in form ? form.userId : userId)
    }

    static add(form, userId) {
        form.userId = userId
        Weibo.create(form)
    }

    user() {
        const u = User.get(this.userId)
        return u
    }

    comments() {
        return Comment.findAll('weiboId', this.id)
    }

    isOwner(id) {
        return this.userId === id
    }


}

module.exports = Weibo