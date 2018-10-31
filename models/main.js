// 引入模块
const fs = require('fs')
const log = require('../utils')

const ensureExists = (path) => {
    const exists = fs.existsSync(path)
    if (!exists) {
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}

const load = (path) => {
    const options = {
        encoding: 'utf8',
    }
    ensureExists(path)
    const s = fs.readFileSync(path, options)
    const data= JSON.parse(s)
    return data
}

const save_data = (data, path) => {
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

class Model {
    constructor(form={}) {
        this.id = 'id' in form ? form.id : undefined
    }

    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = `db/${classname}.json`
        return path
    }

    // 形成类的实例
    static create(form={}) {
        const m = new this(form)
        return m
    }

    static all() {
        const path = this.dbPath()
        const models = load(path) // 返回JSON格式
        const ms = models.map(m => this.create(m))
        return ms
    }

    save() {
        const cls = this.constructor
        const models = cls.all()
        if (this.id === undefined) {
            if (models.length > 0) {
                const tail = models.slice(-1)[0]
                this.id = tail.id + 1
            } else {
                this.id = 0
            }
            models.push(this)
        } else {
            let index = models.findIndex(k => k.id === this.id)
            if (index > -1) {
                models[index] = this
            }
        }
        const path = cls.dbPath()
        save_data(models, path)
    }

    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }

}

module.exports = Model