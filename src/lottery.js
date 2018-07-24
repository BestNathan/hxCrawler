const { Task } = require('crazy-crawler')
const { write } = require('./util')

module.exports = function getLotteryTask(id, limit, spinner) {
	if (!id || !limit) {
		throw new Error('id and limit must be specified')
	}

	let lotteryTask = new Task({
		name: 'lottery',
		url: 'https://api-promotion.mmall.com/prize/luckyTry',
		method: 'post',
		beforeTask: function({ state, task }) {
			if (!state.openid || !state.sessionid) {
				return false
			}

			task.data = {
				openId: state.openid,
				prizeActivityId: id,
				mobileNum: state.username,
				deviceNo: state.device
			}

			task.headers['x-auth-token'] = state.sessionid
		},
		afterTask: function({ response, state }) {
			if (response.data.code !== '200') {
				spinner.fail(state.username + ' ' + response.data.message)
				spinner.start()
				if (response.data.message == '不在活动进行中') {
					spinner.stop()
					process.exit(0)
				}
				return false
			}

			let data = response.data.dataMap
			if (data) {
				let prize = data.prizeName

				write('prize/' + id + '/' + prize + '.txt', state.username + '----' + state.password)
				spinner.succeed(state.username + ' get prize ' + prize)
			} else {
				spinner.fail(state.username + ' no prize!')
			}
			spinner.start()
		},
		fakeIP: true,
		repeat: true,
		limit
	})

	return lotteryTask
}
