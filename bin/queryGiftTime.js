const { CrazyCrawler } = require('crazy-crawler')
const getTask = require('../src/queryGift')
const spinner = require('ora')()

const malls = [130100, 110100]

const task = getTask(malls, spinner)

const c = new CrazyCrawler({ maxTask: 2 })

c.on('done', () => {
	spinner.succeed('work done!')
})

spinner.start('crawling: query gifts and time ...')
c.queueTask(task).run()
