const Todo = require('./models/todo')
const log = require('./utils')

const {
    template,
    headerFromMapper,
    redirect,
    currentUser,
    loginRequired,
} = require('./routes')

const index = (request) => {
    const u = currentUser(request)
    const todoList = Todo.findAll('userId', u.id)
    const html = todoList.map(t =>
        `
        <h3>
            ${t.id} : ${t.title}
            创建时间: ${t.createdTime}
            修改时间: ${t.updatedTime}
            <a href="/todo/edit?id=${t.id}">编辑</a>
            <a href="/todo/delete?id=${t.id}">删除</a>
        </h3>
        `
    ).join('')
    let body = template('todo_index.html')
    body = body.replace('{{todos}}', html)

    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const add = (request) => {
    const form = request.form()
    const t = Todo.create(form)
    const u = currentUser(request)
    t.userId = u.id
    t.createdTime = new Date().toLocaleString()
    t.updatedTime = new Date().toLocaleString()
    t.save()
    return redirect('/todo')
}

const remove = (request) => {
    const todoId = Number(request.query.id)
    log('todoId', todoId)
    Todo.remove(todoId)
    return redirect('/todo')
}

const edit = (request) => {
    let body = template('todo_edit.html')
    const todoId = Number(request.query.id)
    const t = Todo.findBy('id', todoId)
    const u = currentUser(request)
    if (u.id === t.userId) {
        const todoTitle = t.title
        body = body.replace('{{todoId}}', todoId)
        body = body.replace('{{todoTitle}}', todoTitle)
        const headers = {
            'Content-Type': 'text/html',
        }
        const header = headerFromMapper(headers)
        const r = header + '\r\n' + body
        return r
    } else {
        return redirect('/todo')
    }
}

const update = (request) => {
    const form = request.form()
    if (Todo.is_owner(form, request)) {
        Todo.update(form)
    }
    return redirect('/todo')
}


const routeTodo = () => {
    const d = {
        '/todo': loginRequired(index),
        '/todo/add': add,
        '/todo/edit': edit,
        '/todo/update': loginRequired(update),
        '/todo/delete': loginRequired(remove),
    }
    return d
}

module.exports = routeTodo