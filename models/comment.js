const Model = require('./main')
const User = require('./user')

class Comment extends Model {
    constructor(form={}, userId=-1) {
        super(form)
        this.content = form.content || ''
        // 和别的数据关联的方式, 用 userId 表明拥有它的 user 实例
        this.userId = Number('userId' in form ? form.userId : userId)
        this.weiboId = Number('weiboId' in form ? form.weiboId : -1)
    }

    user() {
        const u = User.get(this.userId)
        return u
    }

    static update(form) {
        const commitId = Number(form.id)
        const c = this.get(commentId)
        const validNames = [
            'content',
        ]
        Object.keys(form).forEach(k => {
            if (validNames.includes(k)) {
                c[k] =form[k]
            }
        })
        c.save()
    }
}

module.exports = Comment
