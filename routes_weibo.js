const Weibo = require('./models/weibo')
const Comment = require('./models/comment')
const User = require('./models/user')

const {
    headerFromMapper,
    redirect,
    currentUser,
    error,
    loginRequired,
    htmlResponse,
} = require('./routes')

const {template, log} = require('./utils')

const index = (request) => {
}


const routeMapper = () => {
    // const d = {
    //     '/weibo/index': loginRequired(index),
    //     '/weibo/new': loginRequired(create),
    //     '/weibo/add': loginRequired(add),
    //     '/weibo/delete': loginRequired(remove),
    //     '/weibo/edit': loginRequired(edit),
    //     '/weibo/update': loginRequired(update),
    //     // 评论功能
    //     '/comment/add': loginRequired(commentAdd),
    //     '/comment/update': loginRequired(commentUpdate),
    //     '/comment/edit': loginRequired(commentEdit),
    //     '/comment/delete': loginRequired(commentRemove),
    // }
    // return d
}
//
module.exports = routeMapper
