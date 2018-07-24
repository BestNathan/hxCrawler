const { Task } = require('crazy-crawler')
const { isBoolean } = require('util')
const { write } = require('./util')

const url = 'https://api-order.mmall.com/p-trade-oc-web/orderApi/cApp/queryOrder/ALL?currentPage=1&version=v1&showCount=10&appId=C1C50237&appVersion=3.3.1'

module.exports = function getQueryOrderTask(spinner) {

    let queryOrderTask = new Task({
        name: 'queryOrder',
        url,
        beforeTask: function({ state, task }) {
            if (!state.openid || !state.sessionid) {
                return false
            }

            task.headers['x-auth-token'] = state.sessionid
        },
        afterTask: function({ response, state }) {
            if (response.data.code != '200') {
                if (spinner) {
                    spinner.fail('query fail: ' + response.data.message)
                }
                return false
            }

            let flag = false

            let data = response.data.data

            if (data) {
                data.forEach(item => {
                    let merchant = item.merchantName
                    let product = item.orderItems[0].productName
                    let orderNum = item.serialNumber
                    let status = item.orderStatusDesc
                    let content = `${merchant}----${product}----${orderNum}----${status}`
                    spinner.succeed(content)
                    write(`queryOrder/${product}.txt`, content)
                })
                return false
            }

            return flag
        },
        fakeIP: true
    })

    return queryOrderTask
}
