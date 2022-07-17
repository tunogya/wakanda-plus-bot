const { SlashCommandBuilder } = require('@discordjs/builders');
const { getIdByUserId, getUser } = require("../dynamodb/wakandaplus");
const { isAddress } = require("../utils/address");

module.exports = {
	data: new SlashCommandBuilder()
			.setName('claimrole')
			.setDescription('Claim role manually.'),
	async execute(interaction) {
		const id = await getIdByUserId(interaction.user.id);
		if (id) {
			const q = await getUser(id);
			const info = q.Item;
			try {
				const wallets = Array.from(info.wallets);
				wallets.filter(address => isAddress(address)).forEach(address => {
					// query balance of address
					
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
