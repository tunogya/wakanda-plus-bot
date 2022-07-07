const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('revokerole')
		.setDescription(`Revoke a role`),
	async execute(interaction) {
		await interaction.reply({
			content: 'Please wait.',
			ephemeral: true,
		});
	},
};