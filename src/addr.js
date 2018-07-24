const { Task } = require('crazy-crawler')

module.exports = function getAddressTask(spinner) {
	let addressTask = new Task({
		name: 'address',
		url: 'https://api-user.mmall.com/api/userAddress/mergeUserAddressInfo',
		method: 'post',
		beforeTask: function({ state, task }) {
			if (!state.openid || !state.sessionid) {
				return false
			}

			task.data = `address=%E5%AD%A6%E9%99%A2%E8%B7%AF%E5%94%AF%E5%AE%9E%E5%A4%A7%E5%8E%A6&appId=C1C50237&appVersion=3.3.1&city=%E5%8C%97%E4%BA%AC%E5%B8%82&cityCode=110100&communityName=%E8%91%A3%E9%9B%84%E4%BC%9F&communityTele=13121657155&device=${
				state.device
			}&distribute=%E6%B5%B7%E6%B7%80%E5%8C%BA&distributeCode=110108&houseCode=&isDefault=0&province=%E5%8C%97%E4%BA%AC%E5%B8%82&provinceCode=110000&userId=${
				state.userId
			}`

			task.headers['x-auth-token'] = state.sessionid
		},
		afterTask: function({ response, state }) {
			if (response.data.code != '200') {
				spinner.fail(state.username + ' ' + response.data.message)
				spinner.start()
				return false
			}

			spinner.succeed(state.username + ' add address success! ')
			spinner.start()
		},
		fakeIP: true
	})

	return addressTask
}
