const redisClient = require('../libs/redis.js');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		console.log(message)
	},
};
