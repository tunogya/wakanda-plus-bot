const redisClient = require('../libs/redis.js');
const openai = require('../libs/openai.js');
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot) return
		// check if the message is in a channel that is in the list of channels that we want to listen to
		const intention = redisClient.get(`${message.guildId}-${message.channelId}-${message.author.id}-intention`);
		
		if (intention) {
			const res = await openai.createCompletion({
				model: intention.model,
				prompt: message.content,
				temperature: intention.temperature,
				top_p: intention.top_p,
				max_tokens: intention.max_tokens,
				frequency_penalty: intention.frequency_penalty,
				presence_penalty: intention.presence_penalty,
				best_of: intention.best_of
			});
			
			const org = res.config.headers['OpenAI-Organization']
			
			const sponsorships = await redisClient.incr(`${org}-sponsorships`)
			
			const embed = new MessageEmbed()
					.setTitle('Sponsors Overview')
					.setDescription(`Sponsor: ${res.headers['openai-organization'].toUpperCase()}

${res.headers['openai-organization'].toUpperCase()} already sponsored ${sponsorships} ${sponsorships > 1 ? 'times' : 'time'}.

Everyone can sponsor this AI bot if you have access to OpenAI's API. We are very much looking forward to the DALL-E 2 model joining the community.`);

			await message.reply({
				content: res.data.choices[0].text,
				embeds: [embed],
			})
		}
	},
};
