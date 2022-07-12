const openai = require('../libs/openai');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author?.bot) return;
		// only support guild(Wakanda Metaverse) messages
		if (message.guildId !== '980009405401677854') return;
		// support messages from 'davinci' channel
		let model, price;
		switch (message.channelId) {
		case '996278471422660688':
			model = 'text-davinci-002';
			price = 0.00006;
			break;
		case '996280015379509288':
			model = 'text-curie-001';
			price = 0.000006;
			break;
		case '996280421283266733':
			model = 'text-babbage-001';
			price = 0.0000012;
			break;
		case '996280490237632622':
			model = 'text-ada-001';
			price = 0.0000008;
			break;
		default:
			price = 0;
			return;
		}
		
		const res = await openai.createCompletion({
			model: model,
			prompt: message.content,
			temperature: 0.9,
			top_p: 1,
			max_tokens: 100,
			frequency_penalty: 0,
			presence_penalty: 0.6,
		});
		
		const embed = new MessageEmbed()
			.setTitle('Payments Overview')
			.setDescription(
				`The cost of this request: $${res.data.usage.total_tokens * price}.`
			);
		
		await message.reply({
			content: res.data.choices[0].text,
			embeds: [embed],
		});
	},
};
