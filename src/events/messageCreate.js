const openai = require('../libs/openai');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author?.bot) return;
		// only support guild(Wakanda Metaverse) messages
		if (message.guildId !== '980009405401677854') return;
		// support messages from 'davinci' channel
		if (message.channelId === '996278471422660688') {
			const res = await openai.createCompletion({
				model: 'text-davinci-002',
				prompt: '```' + message.content + '```',
				temperature: 0.9,
				top_p: 1,
				max_tokens: 100,
				frequency_penalty: 0,
				presence_penalty: 0.6,
			})
			
			await message.reply({
				content: res.data.choices[0].text,
			});
		}
		// support messages from 'curie' channel
		else if (message.channelId === '996280015379509288') {
			const res = await openai.createCompletion({
				model: 'text-curie-001',
				prompt: '```' + message.content + '```',
				temperature: 0.9,
				top_p: 1,
				max_tokens: 150,
				frequency_penalty: 0,
				presence_penalty: 0.6,
			})
			
			await message.reply({
				content: res.data.choices[0].text,
			});
		}
		// support messages from 'babbage' channel
		else if (message.channelId === '996280421283266733') {
			const res = await openai.createCompletion({
				model: 'text-babbage-001',
				prompt: '```' + message.content + '```',
				temperature: 0.9,
				top_p: 1,
				max_tokens: 150,
				frequency_penalty: 0,
				presence_penalty: 0.6,
			})
			
			await message.reply({
				content: res.data.choices[0].text,
			});
		}
		// support messages from 'ada' channel
		else if (message.channelId === '996280490237632622') {
			const res = await openai.createCompletion({
				model: 'text-ada-001',
				prompt: '```' + message.content + '```',
				temperature: 0.9,
				top_p: 1,
				max_tokens: 150,
				frequency_penalty: 0,
				presence_penalty: 0.6,
			})
			
			await message.reply({
				content: res.data.choices[0].text,
			});
		}
	},
};
