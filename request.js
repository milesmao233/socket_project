const log = require('./utils')

class Request {
    constructor(raw) {
        const {method, path, query, headers, body} = this.parsedRaw(raw)
        this.raw = raw
        this.method = method
        this.path = path
        this.query = query
        this.body = body
        this.headers = {}
        this.cookies = {}

        this.addHeaders(headers)
    }

    addCookies() {
        const cookies = this.headers.Cookie || ''
        const pairs = cookies.split('; ')
        pairs.forEach((pair) => {
            if (pair.includes('=')){
                const [k, v] = pair.split('=')
                this.cookies[k] = v
            }
        })
    }

    addHeaders(headers) {
        headers.forEach((header) => {
            const [k, v] = header.split(': ')
            this.headers[k] = v
        })

        this.addCookies()
    }

    form() {
        const body = decodeURIComponent(this.body)
        const pairs = body.split('&')
        const d = {}
        pairs.forEach((pair) => {
            const[k, v] = pair.split('=')
            d[k] = v
        })
        return d
    }

    parsedPath(path) {
        const index = path.indexOf('?')
        if (index === -1) {
            return {
                path: path,
                query: {},
            }
        } else {
            const l = path.split('?')
            path = l[0]

            const search = l[1]
            const args = search.split('&')
            const query = {}
            args.forEach(arg => {
                const [k, v] = arg.split('=')
                query[k] = v
            })

            return {
                path: path,
                query: query,
            }
        }
    }

    parsedRaw(raw) {
        const r = raw
        const line = r.split(' ')
        const [method, url] = line
        const {path, query} = this.parsedPath(url)
        const message = r.split('\r\n\r\n')
        const headers = message[0].split('\r\n').slice(1)
        const body = message[1]

        return {
            method: method,
            path: path,
            query: query,
            headers: headers,
            body: body,
        }
    }
}

module.exports = Request


