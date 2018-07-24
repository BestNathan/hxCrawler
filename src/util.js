const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

function read(path) {
	if (fs.existsSync(path)) {
		return fs.readFileSync(path).toString()
	}

	return ''
}

function write(path, content) {
	content = content.endsWith('\r\n') ? content : content + '\r\n'
	if (fs.existsSync(path)) {
		if (!~read(path).indexOf(content)) {
			fs.appendFileSync(path, content)
		}
	} else {
		ensureDir(path)
		fs.writeFileSync(path, content)
	}
}

function ensureDir(paths) {
	let dirs = paths.split('/')
	let tmpdir = ''
	dirs.forEach(dir => {
		if (~dir.indexOf('.')) {
			return
		}
		tmpdir = tmpdir ? path.join(tmpdir, dir) : dir
		if (tmpdir && !fs.existsSync(tmpdir)) {
			fs.mkdirSync(tmpdir)
		}
	})
}

const MD5 = source => {
	let hash = crypto.createHash('md5')
	hash.update(source)
	return hash.digest('hex')
}

module.exports = {
	read,
	write,
	MD5,
	ensureDir
}
