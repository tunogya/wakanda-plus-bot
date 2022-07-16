const redisClient = require('../libs/redis.js');
const openai = require('../libs/openai.js');
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot) return
		// check if the message is in a channel that is in the list of channels that we want to listen to
		const intention = await redisClient.get(`${message.guildId}-${message.channelId}-${message.author.id}-intention`);
		if (intention) {
			const intentionObj = JSON.parse(intention);
			const response = await openai.createCompletion({
				model: intentionObj.model,
				prompt: message.content,
				temperature: intentionObj.temperature,
				top_p: intentionObj.top_p,
				max_tokens: intentionObj.max_tokens,
				frequency_penalty: intentionObj.frequency_penalty,
				presence_penalty: intentionObj.presence_penalty,
				best_of: intentionObj.best_of,
				user: message.author.id,
				n: intentionObj.n,
				suffix: intentionObj.suffix,
				echo: intentionObj.echo,
			}, {
				responseType: "stream"
			});
			await redisClient.del(`${message.guildId}-${message.channelId}-${message.author.id}-intention`);
			
			const stream = response.data
			let tokens = ''
			message.reply('Okay, I\'m thinking...');
			stream.on('data', data => {
				const data_str = data.toString()
				try {
					const token = JSON.parse(data_str.slice(6)).choices[0].text
					tokens += token
					message.edit(tokens)
				} catch (_) {
				}
			});
			
			stream.on('end', () => {
				console.log("stream done");
			});
		}
	},
};
