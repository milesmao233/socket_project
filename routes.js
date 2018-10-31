const log = require('./utils')

const headerFromMapper = (mapper={}, code=200) => {
    let base = `HTTP/1.1 ${code} OK \r\n`
    const s = Object.keys(mapper).map(k => `${k}: ${mapper[k]}\r\n`).join('')
    const header = base + s
    return header
}

const index = (request) => {
    const headers = {
        'Content-Type': 'text/html'
    }
    const header = headerFromMapper(headers)
    let body = 'Hello World'

    const r = header + '\r\n' + body
    return r
}

const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
    }
    const r = e[code] || ''
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