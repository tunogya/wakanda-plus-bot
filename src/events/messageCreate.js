module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author?.bot) return;
		// only support guild(Wakanda Metaverse) messages
		if (message.guildId !== '980009405401677854') return;
		// support messages from 'davinci' channel
		if (message.channelId === '996278471422660688') {
			await message.reply({
				content: 'davinci',
			});
		}
		// support messages from 'curie' channel
		else if (message.channelId === '996280015379509288') {
			await message.reply({
				content: 'curie',
			});
		}
		// support messages from 'babbage' channel
		else if (message.channelId === '996280421283266733') {
			await message.reply({
				content: 'babbage',
			});
		}
		// support messages from 'ada' channel
		else if (message.channelId === '996280490237632622') {
			await message.reply({
				content: 'ada',
			});
		}
	},
};
