const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUser } = require('../dynamodb/wakandaplus.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { shortenAddress } = require('../utils/address');
const { getIdByUserId } = require('../dynamodb/wakandaplus.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mywallets')
		.setDescription('Manage your wallets'),
	async execute(interaction) {
		const id = await getIdByUserId(interaction.user.id);
		if (id) {
			const q = await getUser(id);
			const info = q.Item;
			try {
				const wallets = info['wallets'] ? Array.from(info['wallets']) : [];
				const row = new MessageActionRow().addComponents(
					wallets.slice(0, 4).map((address) => new MessageButton()
						.setCustomId(address)
						.setLabel(shortenAddress(address))
						.setStyle('SECONDARY'),
					).concat(wallets.length > 4 ?
						[new MessageButton()
							.setCustomId('next')
							.setLabel('»')] : [],
					),
				);
				await interaction.reply({
					content: 'Choose a wallet from the list below:',
					components: [row],
					ephemeral: true,
				});
			} catch (e) {
				console.log(e)
				await interaction.reply({
					content: 'None address.',
					ephemeral: true,
				});
			}

		}
		else {
			await interaction.reply({
				content: 'None user info.',
				ephemeral: true,
			});
		}
	},
};
