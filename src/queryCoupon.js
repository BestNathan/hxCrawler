const { Task } = require('crazy-crawler')

module.exports = function getQueryCouponTask(spinner) {
	let queryCouponTask = new Task({
		name: 'queryCoupon',
		url: 'https://api-promotion.mmall.com/user/coupons/pageNo/1/pageSize/10?status=1&appId=C1C50237&appVersion=3.3.1',
		beforeTask: function({ state, task }) {
			if (!state.openid || !state.sessionid) {
				return false
			}
			task.headers['x-auth-token'] = state.sessionid
		},
		afterTask: function({ response, state, task }) {
			if (response.data.code != '200') {
				if (spinner) {
					spinner.fail('query fail: ' + response.data.message)
					spinner.start()
				}
				return false
			}

			let data = response.data.dataMap.records
			if (data.length) {
				let coupons = []
				data.forEach(item => {
					coupons.push(item.couponName)
					coupons.push(item.couponCode)
				})
				spinner.succeed(`${state.username} coupon: ${coupons.join(' ')}`)
				spinner.start()
			} else {
				if (spinner) {
					spinner.fail(`${state.username} no coupon!`)
					spinner.start()
				}
			}
		},
		fakeIP: true
	})

	return queryCouponTask
}
