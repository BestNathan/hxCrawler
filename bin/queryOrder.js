const { CrazyCrawler, TaskChain } = require('crazy-crawler')
const getLoginTask = require('../src/login')
const getQueryOrderTask = require('../src/queryOrder')
const path = require('path')
const spinner = require('ora')()

const dir = path.join(__dirname, process.argv[2])

if (!dir) {
	spinner.fail('need dir arg')
	process.exit(0)
}

const loginTask = getLoginTask(dir, spinner)
const queryOrderTask = getQueryOrderTask(spinner)

const c = new CrazyCrawler({ maxTask: 10 })
const chain = new TaskChain({ functional: true }).queue([loginTask, queryOrderTask])

c.on('done', () => {
	spinner.succeed('work done!')
})

spinner.start('crawling: query orders ...')
c.queueTask(chain).run()
