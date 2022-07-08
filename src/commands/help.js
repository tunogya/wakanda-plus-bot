const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription(`Get effective help from bot`),
	async execute(interaction) {
		await interaction.reply({
			content: `I can help you connect and manage wallets.

You can control me by sending these commands:

**Wallets**
*/connectwallet* - connect a new wallet
*/mywallets* - manage your wallets
*/deletewallet* - delete a wallet

**Role**
*/claimrole* - claim role manually

**Other**
*/cancel* - cancel the current operation
`,
			ephemeral: true,
		});
	},
};
