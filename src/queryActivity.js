const { Task } = require('crazy-crawler')
const { write } = require('./util')

module.exports = function getQueryActivityTask(from, to, spinner) {
	if (!from || !to) {
		throw new Error('from and to are required!')
	}

	let allfilename = `activities/all.txt`
	let baseUrl = 'https://api-promotion.mmall.com/horseActivityDetail/:id'
	let queryActivityTask = new Task({
		name: 'queryActivity',
		functional: true,
		baseUrl,
		paramSetters: {
			id: function(i) {
				return i + Number(from)
			}
		},
		fakeIP: true,
		limit: to - from + 1,
		handler: function(response) {
			if (response.data.code == 200) {
				if (spinner) {
					spinner.succeed(`query success: ${response.task.params.id}`)
				}
				write(allfilename, `query success: ${response.task.params.id}`)
			}
			let data = response.data.dataMap
			
			if (data) {
				let filename = `activities-name/${data.ownerName}-${data.id}.txt`
				let filename1 = `activities-id/${data.id}-${data.ownerName}.txt`
				let head = `${data.ownerName}-${data.id}\r\n${data.activityName}\r\n${data.description}\r\n${new Date(
					data.startTime
				).toLocaleString()}-${new Date(data.endTime).toLocaleString()}\r\n\r\n`
				write(filename, head)
				write(filename1, head)
				if (spinner) {
					spinner.info(`query success: ${data.ownerName}`)
				}
				write(allfilename, `query success: ${data.ownerName}`)

				data.prizeInfoList.forEach(item => {
					let content = `${item.prizeName}----${new Date(item.startTime).toLocaleString()}----${new Date(
						item.endTime
					).toLocaleString()}----${item.stock}----${item.remainStock}`

					write(filename, content)
					write(filename1, content)
					write(allfilename, content)

					if (spinner) {
						spinner.succeed(content)
						spinner.start()
					}
				})
			}
		}
	})

	return queryActivityTask
}
