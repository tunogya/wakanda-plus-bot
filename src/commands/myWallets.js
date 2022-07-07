const { SlashCommandBuilder } = require('@discordjs/builders');
const redisClient = require('../libs/redis.js');
const { getUser } = require('../dynamodb/wakandaplus.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mywallets')
		.setDescription('Manage your wallets'),
	async execute(interaction) {
		const user = interaction.user;
		const id = await redisClient.get(user.id);
		if (id) {
			const q = await getUser(id);
			const info = q.Item;
			if (info) {
				const wallets = info['wallets'] ? Array.from(info['wallets']) : [];
				const row = new MessageActionRow().addComponents(
					wallets.slice(0, 4).map((item) => new MessageButton()
						.setCustomId(item)
						.setLabel(`:ethereum: ${item}`)
						.setStyle('SECONDARY')
					).concat(wallets.length > 4 ?
						[new MessageButton()
							.setCustomId('next')
							.setLabel('»')] : []
					)
				);
				await interaction.reply({
					content: 'Choose a wallet from the list below:',
					components: [row],
					ephemeral: true,
				});
			}
		}
		else {
			// 通过数据库查询是否真的没有用户数据
			// 如果没有，则创建新的用户记录
			await interaction.reply({
				content: 'None address here.',
				ephemeral: true,
			});
		}
	},
};
