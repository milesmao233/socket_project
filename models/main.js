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
    static _newFromMapper(mapper) {
        const m = new this(mapper)
        return m
    }

    static create(form={}) {
        const m = new this(form)
        m.save()
        return m
    }

    static all() {
        const path = this.dbPath()
        const models = load(path) // 返回JSON格式
        const ms = models.map(m => this._newFromMapper(m))
        return ms
    }

    static findBy(key, value) {
        const models = this.all()
        let m = models.find(e => e[key] === value)
        // for (let m of models) {
        //     if (m[key] === value) {
        //         return m
        //     } else {
        //         return null
        //     }
        // }
        return m || null
    }

    static findAll(key, value) {
        const all = this.all()
        let model = all.filter(k => k[key] === value)
        return model
    }

    static get(id) {
        return this.findBy('id', id)
    }

    static remove(id) {
        const ms = this.all()
        const index = ms.findIndex(m => m.id === id)
        log('index', index)
        if (index > -1) {
            ms.splice(index, 1)
        }
        const path = this.dbPath()
        log('ms', ms)
        save_data(ms, path)
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