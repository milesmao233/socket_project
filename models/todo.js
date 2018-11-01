const Model = require('./main')
const {currentUser} = require('../routes')

class Todo extends Model {
    constructor(form={}) {
        super(form)
        this.title = form.title || ''
        this.userId = 'userId' in form ? form.userId : -1
        this.createdTime = 'createdTime' in form ? form.createdTime : null
        this.updatedTime = 'updatedTime' in form ? form.updatedTime : null
    }

    static update(form) {
        const todoId = Number(form.id || -1)
        const t = this.findBy('id', todoId)
        t.title = form.title
        t.updatedTime = new Date().toLocaleDateString()
        t.save()
    }

    static is_owner(form, request) {
        const todoId = Number(form.id || -1)
        const t = Todo.findBy('id, todoId')
        const u = currentUser(request)
        return u.id === t.userId
    }
}

module.exports = Todo