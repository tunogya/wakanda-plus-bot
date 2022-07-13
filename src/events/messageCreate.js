const openai = require('../libs/openai');
const redisClient = require('../libs/redis.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author?.bot) return;
		if (message.channel.type !== 'text') return;
		const intention = await redisClient.get(`${message.guild.id}-${message.channelId}-${message.author.id}-intention`);
		if (intention) {
			const params = JSON.parse(intention);
			const res = await openai.createCompletion({
				prompt: message.content,
				model: params.model,
				temperature: params.temperature,
				top_p: params.top_p,
				max_tokens: params.max_tokens,
				frequency_penalty: params.frequency_penalty,
				presence_penalty: params.presence_penalty,
				best_of: params.best_of,
			});
			const embed = new MessageEmbed()
				.setTitle('Payment overview')
				.setDescription(`Total tokens: ${res.data.usage.total_tokens}`)
			
			message.reply({
				content: res.data.choices[0].text,
				embeds: [embed],
			});
		}
	},
};
