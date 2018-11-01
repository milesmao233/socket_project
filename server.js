const net = require('net')

const log = require('./utils')
const Request = require('./request')
const {routeMapper, error} = require('./routes')
const routeTodo = require('./routes_todo')



const responseForRequest = (request) => {
    const route = {}
    Object.assign(route, routeMapper())
    Object.assign(route, routeTodo())
    const response = route[request.path] || error
    const r = response(request)
    // log('response', r)
    return r
}


const processRequest = (socket, data) => {
    const s = socket
    const r = data.toString()
    // log(`request log:\n${r}`)
    const request = new Request(r)  // 形成request 对象{}的格式
    // log('request Object:', request)
    const response = responseForRequest(request)
    s.write(response)
    s.destroy()
}


const run = (host='', port=3000) => {
    const server = new net.Server()

    // 服务器监听连接
    server.listen(port, host, () => {
        const address = server.address()
        log(`listening server at http://${address.address}:${address.port}`)
    })

    // 建立新的连接，触发connection
    server.on('connection', (s) => {
        s.on('data', (data) => {
            const ip = s.localAddress
            log(`ip, ${ip}`)
            processRequest(s, data)
        })
    })

    server.on('error', (error) => {
        log('server error', error)
    })


    server.on('close', () => {
        log('server closed')
    })

}

const __main = () => {
    run('127.0.0.1', 5000)
}

if (require.main === module) {
    __main()
}