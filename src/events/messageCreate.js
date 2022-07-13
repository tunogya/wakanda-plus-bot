const openai = require('../libs/openai');
const redisClient = require('../libs/redis.js');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author?.bot) return;
		if (message.channel.type !== 'text') return;
		const intention = await redisClient.get(`${message.guild.id}-${message.channelId}-${message.author.id}-intention`);
		if (intention) {
			const params = JSON.parse(intention);
			const response = await openai.createCompletion({
				prompt: message.content,
				model: params.model,
				temperature: params.temperature,
				top_p: params.top_p,
				max_tokens: params.max_tokens,
				frequency_penalty: params.frequency_penalty,
				presence_penalty: params.presence_penalty,
				best_of: params.best_of,
			});
			message.channel.send(response);
		}
	},
};
