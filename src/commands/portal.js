const { SlashCommandBuilder } = require('@discordjs/builders');
const { WAKANDAPASS_ADDRESS } = require("../constant/address");
const SupportedChainId = require("../constant/chains");
const { getExplorerLink, ExplorerDataType } = require("../utils/getExplorerLink");

module.exports = {
	data: new SlashCommandBuilder()
			.setName('portal')
			.setDescription('Portal of WakandaPass.'),
	async execute(interaction) {
		await interaction.reply({
			content: `Goerli portal: *${getExplorerLink(SupportedChainId.GOERLI, WAKANDAPASS_ADDRESS[SupportedChainId.GOERLI], ExplorerDataType.TOKEN)}*
`,
		})
	},
};
