const fs = require('fs')
const { Console } = require('console')
const path = require('path')
const nunjucks = require('nunjucks')

const formattedTime = () => {
    const d = new Date()
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const date = d.getDate()

    const hour = d.getHours()
    const minute = d.getMinutes()
    const second = d.getSeconds()

    const t = `${year}/${month}/${date} ${hour}:${minute}:${second}`

    return t
}

const log = (...args) => {
    const path = './log.txt'
    const output = fs.createWriteStream(path, {
        flags: 'a'
    })
    const t = formattedTime()
    console.log.call(console, t, ...args)
    const logger = new Console(output)
    logger.log(t, ...args)
}

const configuredEnvironment = (() => {
    let env = null
    const f = () => {
        if (env === null) {
            // 得到用于加载模板的目录
            const p = path.join(__dirname, 'templates')
            // nunjucks 会从这个目录中读取模板, 调用 render 方法加载模板并且返回
            env = nunjucks.configure(p)
            return env
        } else {
            return env
        }
    }
    return f
})()

const template = (path, data) => {
    const env = configuredEnvironment()
    const r = env.render(path, data)
    return r
}

module.exports = {
    log: log,
    template: template,
}