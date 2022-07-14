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
			const res = await openai.createCompletion({
				model: intentionObj.model,
				prompt: intentionObj.content,
				temperature: intentionObj.temperature,
				top_p: intentionObj.top_p,
				max_tokens: intentionObj.max_tokens,
				frequency_penalty: intentionObj.frequency_penalty,
				presence_penalty: intentionObj.presence_penalty,
				best_of: intentionObj.best_of
			});
			await redisClient.del(`${message.guildId}-${message.channelId}-${message.author.id}-intention`);
			const org = res.config.headers['OpenAI-Organization']

			const sponsorships = await redisClient.incr(`${org}-sponsorships`)
			
			const embed = new MessageEmbed()
					.setTitle('Sponsors Overview')
					.setDescription(`**${res.headers['openai-organization'].toUpperCase()}** already sponsored **${sponsorships}** ${sponsorships > 1 ? 'times' : 'time'} in this guild.

Everyone can sponsor this AI bot if you have access to OpenAI's API.\nWe are very much looking forward to the **DALL-E 2** model joining the community.`);
			await message.reply({
				content: res.data.choices[0].text,
				embeds: [embed],
			})
		}
	},
};
