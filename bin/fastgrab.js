const { CrazyCrawler, TaskChain } = require('crazy-crawler')
const scheduler = require('node-schedule')
const path = require('path')
const getGrabTask = require('../src/fastgrab')
const getLoginTask = require('../src/login')
const getAddressTask = require('../src/findaddr')
const spinner = require('ora')()

const sku = process.argv[2]
const merchantId = process.argv[3]
const oprice = process.argv[4]
const pprice = process.argv[5]
const dir = path.join(__dirname, process.argv[6])
const cronTime = process.argv[9] && process.argv[9].replace(/-/gm, ' ')
const promotionId = process.argv[7]
const city = process.argv[8]

if (!dir) {
	spinner.fail('need dir arg')
	process.exit(0)
}

const grabTask = getGrabTask(promotionId, sku, merchantId, oprice, pprice, spinner)
const addrTask = getAddressTask(city, spinner)
const loginTask = getLoginTask(dir)

const c = new CrazyCrawler({ maxTask: 10 })
const taskChain = new TaskChain({ functional: true }).queue([loginTask, addrTask, grabTask])

c.on('done', () => {
	spinner.succeed('work done!')
	process.exit(0)
})

const run = () => {
	spinner.start('crawling: grab cupon ' + sku + ' ...')
	c.queueTask(taskChain).run()
}

if (cronTime) {
	spinner.start('waiting to run...')
	scheduler.scheduleJob(cronTime, run)
} else {
	run()
}
