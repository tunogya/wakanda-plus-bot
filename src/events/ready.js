const log = require("../libs/log.js")

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		log.info(`Ready! Logged in as ${client.user.tag}`)
	},
};
