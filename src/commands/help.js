const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription(`Get effective help from bot`),
	async execute(interaction) {
		await interaction.reply({
			content: `I can help you connect and manage crypto wallets. When you add every verified wallet and you have some special tokens, you will be granted special privileges.

You can control me by sending these commands:

Wallets
/connectwallet - connect a new wallet
/mywallets - manage your wallets
/deletewallet - delete a wallet

Role Settings
/claimrole - claim role manually
/revokerole - revoke a role

Other
/cancel - cancel the current operation
`
		})
	}
};
