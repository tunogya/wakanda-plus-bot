const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const client = require('../libs/redis.js');
const randomString = require('../utils/randomString.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isButton()) return;
		if (interaction.customId === 'toConnectWallet') {
			const user = interaction.user.id;
			const state = randomString(12);
			const message = `My discord is ${interaction.user.tag} and i want to connect my wallet in Wakanda Metaverse. ${new Date().toISOString()}`
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
			const embed = new MessageEmbed()
				.setTitle('Please read instructions carefully before connecting')
				.setDescription(
					'You should expect to sign the following message when prompted by a non-custodial wallet such as MetaMask.\nMake sure you sign the EXACT message and NEVER share your seed phrase or private key.'
				);
			
			await interaction.reply({
				content: message,
				components: [row],
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
};
