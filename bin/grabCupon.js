const { CrazyCrawler, TaskChain } = require('crazy-crawler')
const scheduler = require('node-schedule')
const path = require('path')
const getGrabTask = require('../src/grab')
const getLoginTask = require('../src/login')
const spinner = require('ora')()

const id = process.argv[2]
const dir = path.join(__dirname, process.argv[3])
const cronTime = process.argv[4].replace(/-/gm, ' ')

if (!id || id == -1) {
	spinner.fail('need id arg')
	process.exit(0)
}

if (!dir) {
	spinner.fail('need dir arg')
	process.exit(0)
}

const grabTask = getGrabTask(id, 20, 1, spinner)
const loginTask = getLoginTask(dir)

const c = new CrazyCrawler({ maxTask: 10 })
const taskChain = new TaskChain({ functional: true }).queue([loginTask, grabTask])

c.on('done', () => {
	spinner.succeed('work done!')
	process.exit(0)
})

const run = () => {
	spinner.start('crawling: grab cupon ' + id + ' ...')
	c.queueTask(taskChain).run()
}

if (cronTime) {
	spinner.start('waiting to run...')
	scheduler.scheduleJob(cronTime, run)
} else {
	run()
}
