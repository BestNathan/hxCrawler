const { CrazyCrawler } = require('crazy-crawler')
const getTask = require('../src/queryActivity')
const spinner = require('ora')()

const from = process.argv[2]
const to = process.argv[3]

if (!from || !to) {
	console.log('need from and to arg')
	process.exit(0)
}

const task = getTask(from, to, spinner)

const c = new CrazyCrawler({ maxTask: 10 })

c.on('done', () => {
	spinner.succeed('work done!')
})

spinner.start('crawling: query activities ...')
c.queueTask(task).run()


