const { Task } = require('crazy-crawler')

const codes = {
	over: 'PROMOTION_1014',
	success: 200,
	notBegin: 'PROMOTION_1015',
	have: 'PROMOTION_1013'
}

module.exports = function getGrabTask(id, channel, subChannel, spinner) {
	if (!channel || !subChannel) {
		throw new Error('channel and subChannel are required!')
	}

	const baseUrl =
		'https://wap.mmall.com/api-coupon/channel/' + channel + '/name/1/subChannel/' + subChannel + '/user/cupon/'
	let grabTask = new Task({
		name: 'grabCupon',
		url: baseUrl + id,
		method: 'post',
		repeat: true,
		limit: a => true,
		beforeTask: function({ state, task }) {
			if (!state.sessionid) {
				return false
			}
			task.headers['x-auth-token'] = state.sessionid
		},
		afterTask: function({ response, state }) {
			if (response.data.code == codes.success || response.data.code == codes.have) {
				if (spinner) {
					spinner.succeed(state.username + ' grab the cupon ' + id)
				}
				return false
			}

			if (response.data.code == codes.over) {
				if (spinner) {
					spinner.fail('cupon ' + id + ' is over!')
				}
				return false
			}

			if (response.data.code == codes.notBegin) {
				if (spinner && !state.grabLog) {
					spinner.info(state.username + ' | cupon ' + id + ' is grabing!')
					spinner.start()
					state.grabLog = true
				}
				return true
			}

			spinner.fail('cupon ' + id + ' has an unknown message :' + response.data.code + '|' + response.data.message)
			return false
		}
	})

	return grabTask
}
