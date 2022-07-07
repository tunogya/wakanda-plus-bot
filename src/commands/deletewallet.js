const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletewallet')
		.setDescription(`Delete a wallet`),
	async execute(interaction) {
		await interaction.reply({
			content: 'Please enter the wallet address to be deleted.',
			ephemeral: true,
		});
	},
};
