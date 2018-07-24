const { Task } = require('crazy-crawler')

module.exports = function getGetPrizeTask(spinner) {
	let getPrizeTask = new Task({
		name: 'getPrize',
		url: 'https://api-promotion.mmall.com/prize/acquirePrize',
		method: 'post',
		beforeTask: function({ state, task }) {
			if (!state.openid || !state.sessionid) {
				return false
			}

			task.data = {
				openId: state.openid,
				prizeActivityId: state.id,
				lotteryInfos: [
					{ lotteryInfoType: '1', lotteryInfoValue: state.password },
					{ lotteryInfoType: '3', lotteryInfoValue: state.username }
				],
				prizeId: state.prizeId + ''
			}

			task.headers['x-auth-token'] = state.sessionid
		},
		afterTask: function({ response, state }) {
			if (response.data.code == '200') {
				if (spinner) {
					spinner.succeed(state.username + 'get success!')
				}
			} else {
				if (spinner) {
					spinner.fail(state.username + ' get fail! ' + response.data.message)
				}
			}
		},
		fakeIP: true
	})

	return getPrizeTask
}
