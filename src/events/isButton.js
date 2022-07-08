const { MessageActionRow, MessageButton } = require('discord.js');
const client = require('../libs/redis.js');
const randomString = require('../utils/randomString.js');
const { isAddress, shortenAddress } = require('../utils/address');
const redisClient = require('../libs/redis.js');
const { getUser } = require('../dynamodb/wakandaplus.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isButton()) return;
		if (interaction.customId === 'toConnectWallet') {
			const user = interaction.user.id;
			const state = randomString(12);
			const message = `My account is ${interaction.user.tag}. I want to connect my wallet in Wakanda Metaverse. ${new Date().toLocaleString()}`
			await client.set(
				state,
				JSON.stringify({
					user: user,
					message: message
				}),
				{
					EX: 300,
				}
			);
			
			const row = new MessageActionRow().addComponents(
				new MessageButton()
					.setLabel('Connect Wallet')
					.setURL(`https://wakandaplus.wakanda.cn/#/${state}`)
					.setStyle('LINK')
			);
			
			await interaction.reply({
				content: `**Sign the message below in 5 min:**\`\`\`${message}\`\`\`
Make sure you sign the EXACT message and NEVER share your seed phrase or private key.`,
				embeds: [],
				components: [row],
				ephemeral: true,
			});
		}
		else if (isAddress(interaction.customId)) {
			const row = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('mywallets')
					.setLabel('« Back to Wallet List')
					.setStyle('SECONDARY')
			);
			
			await interaction.update({
				content: `You select ${shortenAddress(interaction.customId)}`,
				components: [row],
				ephemeral: true
			})
		}
		else if (interaction.customId === 'mywallets') {
			const user = interaction.user;
			const id = await redisClient.get(user.id);
			if (id) {
				const q = await getUser(id);
				const info = q.Item;
				if (info) {
					const wallets = info['wallets'] ? Array.from(info['wallets']) : [];
					const row = new MessageActionRow().addComponents(
						wallets.slice(0, 4).map((address) => new MessageButton()
							.setCustomId(address)
							.setLabel(shortenAddress(address))
							.setStyle('SECONDARY')
						).concat(wallets.length > 4 ?
							[new MessageButton()
								.setCustomId('next')
								.setLabel('»')] : []
						)
					);
					await interaction.update({
						content: 'Choose a wallet from the list below:',
						components: [row],
						ephemeral: true,
					});
				}
			}
			else {
				// 通过数据库查询是否真的没有用户数据
				// 如果没有，则创建新的用户记录
				await interaction.update({
					content: 'None address here.',
					ephemeral: true,
				});
			}
		}
	},
};
