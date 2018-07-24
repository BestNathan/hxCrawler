const { Task } = require('crazy-crawler')

module.exports = function getAddressTask(city, spinner) {
	let addressTask = new Task({
		name: 'address',
		url: 'https://api-user.mmall.com/api/userAddress/findUserAddressByUserId',
		method: 'post',
		beforeTask: function({ state, task }) {
			if (!state.openid || !state.sessionid) {
				return false
			}

			task.data = `appId=C1C50237&appVersion=3.3.1&deviceId=${state.device}&userId=${state.userId}`

			task.headers['x-auth-token'] = state.sessionid
		},
		afterTask: function({ response, state }) {
			if (response.data.code != '200') {
				spinner.fail(state.username + ' ' + response.data.message)
				spinner.start()
				return false
			}

			if (!response.data.dataMap.length) {
				spinner.fail(state.username + ' no address1')
				spinner.start()
				return false
			}
			
			
			response.data.dataMap.forEach(item => {

				if (item.cityCode == city) {
					state.areaId = item.id
					state.communityName = item.communityName
					state.communityTele = item.communityTele
					state.address = item.address
					state.distribute = item.distribute
					state.distributeCode = item.distributeCode
					state.city = item.city
					state.cityCode = item.cityCode
					state.province = item.province
					state.provinceCode = item.provinceCode
					spinner.succeed(state.username + ' find address success! id: ' + state.areaId)
					spinner.start()
				}
			})
		},
		fakeIP: true
	})

	return addressTask
}
