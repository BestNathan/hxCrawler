const { Task } = require('crazy-crawler')
const { write } = require('./src/util')

new Task({
	name: 'address',
	url:
		'https://retail-activity.mmall.com/api-rtapi/active/v1.0.0/operation/active?activeId=22&cityName=' + encodeURIComponent('北京市'),
	method: 'get',
	handler: function(res) {
		let items = res.data.dataMap.modules
		items.forEach(item => {

			if (item.brandName) {
				let content = `${item.promotionId}----${item.pdtName}----${item.pdtPrice}----${item.pdtPromotionPrice}----${
					item.pdtSku
				}----${item.shopId}----总数：${item.promotionStock}----时间：${new Date(
					item.startTime
				).toLocaleString()}`
				write('fastgrab.txt', content)
			}
		})
	},
	fakeIP: true
})
	.exec()
	.then(() => {
		console.log('done')
	})
