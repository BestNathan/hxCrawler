const { Task } = require('crazy-crawler')
const { isBoolean } = require('util')
const { write } = require('./util')

module.exports = function getQueryPrizeTask(id, couponId, spinner) {
    if (!id || !couponId) {
        throw new Error('id and couponId must be specificed')
    }

    let queryPrizeTask = new Task({
        name: 'queryPrize',
        url: 'https://api-promotion.mmall.com/listPrizeRecord/%20' + id,
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

            let data = response.data.dataMap.prizeRecordList

            if (data && isBoolean(couponId)) {
                data.forEach(item => {
                    let content = `${state.username}----${state.password}`
                    spinner.succeed(content + `----${item.prizeName}----${item.couponId}`)
                    write(`queryPrizes/${id}/${item.prizeName}-${item.couponId}.txt`, content)
                })

                return false
            }

            if (data) {
                data.forEach(item => {
                    if (item.cStatus == 1 && item.couponId == couponId) {
                        flag = true

                        state.prizeId = item.prizeId
                        state.id = id
                    }

                    if (item.cStatus == 2) {
                        spinner.info(state.username + ' already get!')
                        spinner.start()
                    }
                })
            }

            return flag
        },
        fakeIP: true
    })

    return queryPrizeTask
}
