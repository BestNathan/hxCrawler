const { Task } = require('crazy-crawler')

const codes = {
	over: 'PROMOTION_1014',
	success: 200,
	notBegin: 'PROMOTION_1015',
	have: '200'
}

const messages = {
	notBegin: '爆品已失效',
	over: '活动库存不足'
}

module.exports = function getGrabTask(promotionId, sku, merchantId, oprice, pprice, spinner) {
	const baseUrl = 'https://api-order.mmall.com/p-trade-oc-web/orderApi/cApp/createOrderCApp'
	let grabTask = new Task({
		name: 'fastgrab',
		url: baseUrl,
		method: 'post',
		repeat: true,
		limit: a => true,
		beforeTask: function({ state, task }) {
			if (!state.sessionid) {
				return false
			}

			task.data = {
				communityId: '',
				tel: '',
				districtName: state.distribute,
				remarkVos: [
					{
						remark: '',
						invoiceHead: '',
						promotionTotalAmount: '0.00',
						deliverType: 'DELIVER_HOME',
						merchantId,
						invoiceType: 0,
						taxpayerNumber: '',
						itemPriceChannel: 0,
						extendType: '0',
						carriage: '0.00',
						getInvoice: false
					}
				],
				paymentLines: [],
				channel: '1',
				client: '4',
				areaId: state.areaId,
				streetName: '',
				receiverMobile: state.communityTele,
				streetId: '',
				provinceName: state.province,
				provinceId: state.provinceCode,
				plantform: '3',
				cityId: state.cityCode,
				receiverName: state.communityName,
				promotions: [
					{
						omsPromotion: 'NEW_PROMOTION',
						omsPromotionPriority: '',
						promotionName: '',
						merchantId,
						voucherNo: '',
						promotionType: '31',
						promotionId,
						description: ''
					},
					{
						omsPromotion: 'NEW_PROMOTION',
						omsPromotionPriority: '',
						promotionName: '',
						merchantId,
						voucherNo: '',
						promotionType: '31',
						promotionId,
						description: ''
					}
				],
				districtId: state.distributeCode,
				isByCart: 'false',
				cityName: state.city,
				address: state.address,
				orderItems: [
					{
						quantity: '1',
						isBlatantly: 'true',
						unitPrice: oprice + '0',
						discountRate: '1',
						productId: '',
						merchantId,
						sku,
						canRefund: 'true',
						salePrice: pprice + '.00'
					}
				]
			}

			task.headers['x-auth-token'] = state.sessionid
		},
		afterTask: function({ response, state }) {
			//console.log(response.data);

			if (response.data.code == codes.success || response.data.code == codes.have) {
				if (spinner) {
					spinner.succeed(state.username + ' grab the good ' + sku)
				}
				return false
			}

			if (~response.data.message.indexOf(messages.notBegin)) {
				if (spinner && !state.grabLog) {
					spinner.info(state.username + ' | good ' + sku + ' is grabing!')
					spinner.start()
					state.grabLog = true
				}
				return true
			}

			if (~response.data.message.indexOf(messages.over)) {
				if (spinner) {
					spinner.fail('cupon ' + sku + ' is over!')
				}
				return false
			}

			if (spinner && !state[response.data.message]) {
				spinner.fail('good ' + sku + ' has an unknown message :' + response.data.code + '|' + response.data.message)
				spinner.start()

				state[response.data.message] = true
			}
		}
	})

	return grabTask
}
