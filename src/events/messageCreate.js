const redisClient = require('../libs/redis.js');
const openai = require('../libs/openai.js');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot) return
		// check if the message is in a channel that is in the list of channels that we want to listen to
		const intention = redisClient.get(`${message.guildId}-${message.channelId}-${message.author.id}-intention`);
		if (intention) {
			const q = await openai.createCompletion({
				model: intention.model,
				prompt: message.content,
				temperature: intention.temperature,
				top_p: intention.top_p,
				max_tokens: intention.max_tokens,
				frequency_penalty: intention.frequency_penalty,
				presence_penalty: intention.presence_penalty,
				best_of: intention.best_of
			});
			await message.reply({
				content: q.choices[0].text,
			})
		}
	},
};
