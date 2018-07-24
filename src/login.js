const { Task } = require('crazy-crawler')
const uuid = require('uuid')
const { read, MD5 } = require('./util')
const { isString } = require('util')

const loginBaseData = `_from_app=main_app&_from_app_version=3.2.6&_from_channel=9037&_from_channel_type=qr_code&_from_device=:device&_from_mall_id=10138&_from_mall_name=%E7%9F%B3%E5%AE%B6%E5%BA%84%E6%96%B9%E5%8C%97%E5%95%86%E5%9C%BA&_from_os=:os&_from_os_version=:osV&appId=C1C50237&appVersion=3.2.6&captcha=&deviceId=:device&fromSource=9037&marketCode=10138&marketName=%E7%9F%B3%E5%AE%B6%E5%BA%84%E6%96%B9%E5%8C%97%E5%95%86%E5%9C%BA&password=:password&username=:username`

module.exports = function getLoginTask(path, spinner) {
	if (!isString(path)) {
		throw new Error('path must be a string!')
	}

	if (!path) {
		throw new Error('path must be specificed!')
	}

	const users = read(path)
		.split('\r\n')
		.filter(a => a)

	if (!users.length) {
		spinner.fail('path: ' + path + ' has no users, please check!')
		process.exit(0)
	}

	let loginTask = new Task({
		name: 'login',
		baseUrl: 'https://api-user.mmall.com/api/user/authenticate',
		baseData: loginBaseData,
		method: 'post',
		headers: 'User-Agent: RedStarMain/3.3.1 (iPhone; iOS 8.1.3; Scale/3.00)',
		paramSetters: {
			username: function(i) {
				return users[i].split('----')[0]
			},
			password: function(i) {
				return users[i].split('----')[1]
			},
			device: function() {
				return uuid()
			},
			os: function() {
				return 'Android'
			},
			osV: function() {
				return '4.4.1'
			}
		},
		beforeTask: function({ task, state }) {
			let password = task.params.password
			task.data = task.data.replace(password, MD5(password))
		},
		afterTask: function({ state, response, task }) {
			if (response.data.code !== 200) {
				if (spinner) {
					spinner.fail('login fail: ' + response.data.message)
				}
				return false
			}

			state.sessionid = response.data.dataMap.sessionid
			state.openid = response.data.dataMap.openid
			state.device = task.params.device
			state.username = task.params.username
			state.password = task.params.password
			state.userId = response.data.dataMap.id
		},
		fakeIP: true,
		functional: true,
		limit: users.length
	})

	return loginTask
}
