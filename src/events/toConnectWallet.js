const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const client = require('../libs/redis.js');
const randomString = require('../utils/randomString.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isButton()) return;
		if (interaction.customId === 'toConnectWallet') {
			const member = interaction.user.id;
			const guild = interaction.guild?.id ?? null;
			const state = randomString(12);
			await client.set(
				state,
				JSON.stringify({
					guild: guild,
					member: member,
				}),
				{
					EX: 300,
				}
			);

			const row = new MessageActionRow().addComponents(
				new MessageButton()
					.setLabel('Connect Wallet')
					.setURL(`https://wakandaplus.wakanda.cn/#/sign/${state}`)
					.setStyle('LINK')
			);
			const embed = new MessageEmbed()
				.setTitle('Please read instructions carefully before connecting')
				.setDescription(
					'You should expect to sign the following message when prompted by a non-custodial wallet such as MetaMask.\nMake sure you sign the EXACT message and NEVER share your seed phrase or private key.'
				);

			await interaction.reply({
				content: `Use this custom link to connect (valid for 5 minutes)\nGuild: ${guild} Member: ${member}`,
				components: [row],
				embeds: [embed],
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	},
};
