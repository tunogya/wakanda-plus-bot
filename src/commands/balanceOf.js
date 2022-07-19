const { SlashCommandBuilder } = require('@discordjs/builders');
const { getIdByUserId, getUser } = require("../dynamodb/wakandaplus");
const { isAddress } = require("../utils/address");
const ethers = require("ethers");
const { WAKANDAPASS_ADDRESS } = require("../constant/address");
const SupportedChainId = require("../constant/chains");
const geohash_abi = require("../abis/geohash.json");
const { RinkebyProvider } = require("../libs/web3");

module.exports = {
	data: new SlashCommandBuilder()
			.setName('balanceOf')
			.setDescription('Get balance of a user')
			.addUserOption(option => option.setName('user').setDescription('Target user')),
	async execute(interaction) {
		const user = interaction.options.getUser('user') ?? interaction.user;
		const id = await getIdByUserId(user.id);
		
		if (id) {
			const q = await getUser(id);
			const info = q.Item;
			try {
				const wallets = Array.from(info.wallets);
				const passContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.RINKEBY], geohash_abi, RinkebyProvider)
				let content = ''
				for (const addr of wallets.filter(address => isAddress(address))) {
					// query balance of address
					const balance = (await passContract.balanceOf(addr)).toNumber();
					content += `${addr}: ${balance} PASS`
				}
				await interaction.reply({
					content,
				});
			} catch (e) {
				console.log(e)
				await interaction.reply({
					content: 'None address.',
				});
			}
			
		} else {
			await interaction.reply({
				content: 'None user info.',
				ephemeral: true,
			});
		}
	},
};
