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
			content: `Rinkeby portal: *${getExplorerLink(SupportedChainId.RINKEBY, WAKANDAPASS_ADDRESS[SupportedChainId.RINKEBY], ExplorerDataType.TOKEN)}*
Mumbai portal: *${getExplorerLink(SupportedChainId.POLYGON_MUMBAI, WAKANDAPASS_ADDRESS[SupportedChainId.POLYGON_MUMBAI], ExplorerDataType.TOKEN)}*
Goerli portal: *${getExplorerLink(SupportedChainId.GOERLI, WAKANDAPASS_ADDRESS[SupportedChainId.GOERLI], ExplorerDataType.TOKEN)}*
`,
		})
	},
};
