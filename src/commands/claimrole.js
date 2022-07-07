const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('claimrole')
		.setDescription(`Claim role manually`),
	async execute(interaction) {
		await interaction.reply({
			content: 'Please wait.',
			ephemeral: true,
		});
	},
};