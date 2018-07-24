const { CrazyCrawler, TaskChain } = require('crazy-crawler')
const getLoginTask = require('../src/login')
const getQueryPrizeTask = require('../src/queryPrize')
const path = require('path')
const spinner = require('ora')()

const id = process.argv[2]
const dir = path.join(__dirname, process.argv[3])

if (!id || id == -1) {
	spinner.fail('need id arg')
	process.exit(0)
}

if (!dir) {
	spinner.fail('need dir arg')
	process.exit(0)
}

const loginTask = getLoginTask(dir, spinner)
const queryPrizeTask = getQueryPrizeTask(id, true, spinner)

const c = new CrazyCrawler({ maxTask: 10 })
const chain = new TaskChain({ functional: true }).queue([loginTask, queryPrizeTask])

c.on('done', () => {
	spinner.succeed('work done!')
})

spinner.start('crawling: query prize and get ...')
c.queueTask(chain).run()
