const pino = require('pino');

const log = pino({
	'pino-pretty': {
		levelFirst: true
	},
})

module.exports = log;