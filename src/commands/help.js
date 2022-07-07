const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription(`Get effective help from bot`),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setTitle('You can control me by sending these commands:')
			.setDescription(
				`Wallets
/connectwallet - connect a new wallet
/mywallets - manage your wallets
/deletewallet - delete a wallet

Role Settings
/claimrole - claim role manually
/revokerole - revoke a role

Other
/cancel - cancel the current operation`
			);
		
		await interaction.reply({
			content: `I can help you connect and manage wallets.`,
			embeds: [embed],
			ephemeral: true,
		});
	},
};
