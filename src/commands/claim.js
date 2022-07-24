const { SlashCommandBuilder } = require('@discordjs/builders');
const { RinkebyProvider, MumbaiProvider, GoerliProvider } = require("../libs/web3");
const ethers = require("ethers");
const { WAKANDAPASS_ADDRESS } = require("../constant/address");
const SupportedChainId = require("../constant/chains");
const geohash_abi = require("../abis/geohash.json");
const { getExplorerLink, ExplorerDataType } = require("../utils/getExplorerLink");

module.exports = {
	data: new SlashCommandBuilder()
			.setName('claim')
			.setDescription('Claim a PASS.'),
	async execute(interaction) {
		const rinkebyPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.RINKEBY], geohash_abi, RinkebyProvider)
		const mumbaiPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.POLYGON_MUMBAI], geohash_abi, MumbaiProvider)
		const goerliPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.GOERLI], geohash_abi, GoerliProvider)
		
		const rinkebyBalance = await rinkebyPassContract.balanceOf(WAKANDAPASS_ADDRESS[SupportedChainId.RINKEBY])
		const mumbaiBalance = await mumbaiPassContract.balanceOf(WAKANDAPASS_ADDRESS[SupportedChainId.POLYGON_MUMBAI])
		const goerliBalance = await goerliPassContract.balanceOf(WAKANDAPASS_ADDRESS[SupportedChainId.GOERLI])
		
		await interaction.reply({
			content: `Rinkeby has ${rinkebyBalance.toNumber()} PASS that can be claimed. Click here: *${getExplorerLink(SupportedChainId.RINKEBY, WAKANDAPASS_ADDRESS[SupportedChainId.RINKEBY], ExplorerDataType.TOKEN)}#writeContract#F2*

Mumbai has ${mumbaiBalance.toNumber()} PASS that can be claimed. Click here: *${getExplorerLink(SupportedChainId.POLYGON_MUMBAI, WAKANDAPASS_ADDRESS[SupportedChainId.POLYGON_MUMBAI], ExplorerDataType.TOKEN)}#writeContract#F2*

Goerli has ${goerliBalance.toNumber()} PASS that can be claimed. Click here: *${getExplorerLink(SupportedChainId.GOERLI, WAKANDAPASS_ADDRESS[SupportedChainId.GOERLI], ExplorerDataType.TOKEN)}#writeContract#F2*

> Note: If you don't know the tokenId which is needed by claim action, please *Read Contract* and use *tokenOfOwnerByIndex()* to get tokenId. The owner is the Contract address.
`,
		})
	},
};
