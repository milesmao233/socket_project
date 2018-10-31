const log = require('./utils')
const fs = require('fs')

const headerFromMapper = (mapper={}, code=200) => {
    let base = `HTTP/1.1 ${code} OK \r\n`
    const s = Object.keys(mapper).map(k => `${k}: ${mapper[k]}\r\n`).join('')
    const header = base + s
    return header
}


const template = (name) => {
    const path = 'templates/' + name
    const options = {
        encoding: 'utf8'
    }
    const content = fs.readFileSync(path, options)
    return content
}

const index = (request) => {
    const headers = {
        'Content-Type': 'text/html'
    }
    const header = headerFromMapper(headers)
    let body = template('index.html')

    const r = header + '\r\n' + body
    log('request test', request)
    return r
}

const error = () => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND0\r\n\r\n<h1>NOT FOUND</h1>',
    }
    const r = e[404] || ''
    return r
}

const routeMapper = () => {
    const d = {
        '/': index,
    }

    return d
}


module.exports = {
    routeMapper: routeMapper,
    error: error,
}