const redisClient = require('../libs/redis.js');
const openai = require('../libs/openai.js');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot) return
		// check if the message is in a channel that is in the list of channels that we want to listen to
		const intention = redisClient.get(`${message.guildId}-${message.channelId}-${message.author.id}-intention`);
		if (intention) {
			const intent = JSON.parse(intention);
			const q = await openai.createCompletion({
				model: intent.model,
				prompt: message.content,
				temperature: intent.temperature,
				top_p: intent.top_p,
				max_tokens: intent.max_tokens,
				frequency_penalty: intent.frequency_penalty,
				presence_penalty: intent.presence_penalty,
				best_of: intent.best_of
			});
			await message.reply({
				content: q.choices[0].text,
			})
		}
	},
};
