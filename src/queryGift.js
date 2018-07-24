const { Task } = require('crazy-crawler')
const { write } = require('./util')

module.exports = function getQueryGiftTask(malls, spinner) {
	if (!Array.isArray(malls)) {
		malls = [malls]
	}

	let baseUrl =
		'https://wap.mmall.com/api-rtapi1/active/v1.0.0/promotionSortList/cityCode/:mall/mallCode/all/page/:page/30'
	let queryGiftTask = new Task({
		name: 'queryGift',
		functional: true,
		baseUrl,
		paramSetters: {
			page: function() {
				return 1
			},
			mall: function(counter) {
				return malls[counter]
			}
		},
		limit: malls.length,
		handler: function(response) {
			let data = response.data
			let task = response.task

			if (data && data.code === 200) {
				data.dataMap.records.forEach(cupon => {
					if (cupon.couponType == 57) {
						let content = `${cupon.ownerName}----${cupon.couponShortName}----${cupon.id}----${
							cupon.remainingCount
						}----${new Date(cupon.issueStartTime).toLocaleString()}`
						if (spinner) {
							spinner.succeed(content)
						}
						write(`timeQuery/${cupon.ownerName}.txt`, content)
					}
				})
			}

			if (data.dataMap.pageNo < data.dataMap.totalPages) {
				let page = ++task.params.page
				let mall = task.params.mall
				task.url = baseUrl.replace(':mall', mall).replace(':page', page)
				task.taskState = 0
				return task
			}
		}
	})

	return queryGiftTask
}
