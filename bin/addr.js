const { CrazyCrawler, TaskChain } = require('crazy-crawler')
const getLoginTask = require('../src/login')
const getAddressTask = require('../src/addr')
const path = require('path')
const spinner = require('ora')()

const dir = path.join(__dirname, process.argv[2])


if (!dir) {
	spinner.fail('need dir arg')
	process.exit(0)
}

const loginTask = getLoginTask(dir, spinner)
const addressTask = getAddressTask(spinner)

const c = new CrazyCrawler({ maxTask: 10 })
const chain = new TaskChain({ functional: true }).queue([loginTask, addressTask])

c.on('done', () => {
	spinner.succeed('work done!')
})

spinner.start('crawling: lottery ...')
c.queueTask(chain).run()
