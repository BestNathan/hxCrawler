const { CrazyCrawler, TaskChain } = require('crazy-crawler')
const getLoginTask = require('../src/login')
const getLotteryTask = require('../src/lottery')
const path = require('path')
const spinner = require('ora')()

const id = process.argv[2]
const limit = Number(process.argv[3])
const dir = path.join(__dirname, process.argv[4])

if (!id || id == -1 || !limit) {
	spinner.fail('need id and limit arg')
	process.exit(0)
}

if (!dir) {
	spinner.fail('need dir arg')
	process.exit(0)
}

const loginTask = getLoginTask(dir, spinner)
const lotteryTask = getLotteryTask(id, limit, spinner)

const c = new CrazyCrawler({ maxTask: 10 })
const chain = new TaskChain({ functional: true }).queue([loginTask, lotteryTask])

c.on('done', () => {
	spinner.succeed('work done!')
})

spinner.start('crawling: lottery ...')
c.queueTask(chain).run()
