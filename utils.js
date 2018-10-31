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

const log = console.log.bind(console)

module.exports = log