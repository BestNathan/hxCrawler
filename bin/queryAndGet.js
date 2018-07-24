const { CrazyCrawler, TaskChain } = require('crazy-crawler')
const getLoginTask = require('../src/login')
const getGetPrizeTask = require('../src/getPrize')
const getQueryPrizeTask = require('../src/queryPrize')
const path = require('path')
const spinner = require('ora')()

const id = process.argv[2]
const couponId = process.argv[3]
const dir = path.join(__dirname, process.argv[4])

if (!id || id == -1) {
	spinner.fail('need id arg')
	process.exit(0)
}

if (!couponId || couponId == -1) {
	spinner.fail('need couponId arg')
	process.exit(0)
}

if (!dir) {
	spinner.fail('need dir arg')
	process.exit(0)
}

const loginTask = getLoginTask(dir, spinner)
const queryPrizeTask = getQueryPrizeTask(id, couponId, spinner)
const getPrizeTask = getGetPrizeTask(spinner)

const c = new CrazyCrawler({ maxTask: 15 })
const chain = new TaskChain({ functional: true }).queue([loginTask, queryPrizeTask, getPrizeTask])

c.on('done', () => {
	spinner.succeed('work done!')
})

spinner.start('crawling: query prize and get ...')
c.queueTask(chain).run()
