const { shortenAddress } = require('../utils/address');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isButton()) return;
		if (interaction.customId) {
			// const user = interaction.user.id;
			await interaction.editReply({
				content: `You select ${shortenAddress(interaction.customId)}`,
				components: []
			})
		}
	},
};
