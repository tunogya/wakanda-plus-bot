const { SlashCommandBuilder } = require('@discordjs/builders');
const { getIdByUserId, getUser } = require("../dynamodb/wakandaplus");
const { isAddress } = require("../utils/address");
const ethers = require("ethers");
const { WAKANDAPASS_ADDRESS } = require("../constant/address");
const SupportedChainId = require("../constant/chains");
const geohash_abi = require("../abis/geohash.json");
const { RinkebyProvider, MumbaiProvider, GoerliProvider } = require("../libs/web3");

module.exports = {
	data: new SlashCommandBuilder()
			.setName('balanceof')
			.setDescription('Get balance of a user')
			.addUserOption(option => option.setName('member').setDescription('Target member')),
	async execute(interaction) {
		const member = interaction.options.getMember('member') ?? interaction.member;
		const id = await getIdByUserId(member.id);
		if (id) {
			const q = await getUser(id);
			const info = q.Item;
			try {
				const wallets = Array.from(info.wallets);
				const rinkebyPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.RINKEBY], geohash_abi, RinkebyProvider)
				const mumbaiPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.POLYGON_MUMBAI], geohash_abi, MumbaiProvider)
				const goerliPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.GOERLI], geohash_abi, GoerliProvider)
				let balanceOfRinkeby = 0, balanceOfMumbai = 0, balanceOfGoerli = 0;
				for (const addr of wallets.filter(address => isAddress(address))) {
					// query balance of address
					const [rinkebyBalance, mumbaiBalance, goerliBalance] = await Promise.all([
						rinkebyPassContract.balanceOf(addr),
						mumbaiPassContract.balanceOf(addr),
						goerliPassContract.balanceOf(addr),
					]);
					balanceOfRinkeby += rinkebyBalance.toNumber();
					balanceOfMumbai += mumbaiBalance.toNumber();
					balanceOfGoerli += goerliBalance.toNumber();
				}
				if (balanceOfRinkeby) {
					member.roles.add('989763514077945906')
				} else {
					member.roles.remove('989763514077945906')
				}
				if (balanceOfMumbai) {
					member.roles.add('989764462342983720')
				} else {
					member.roles.remove('989764462342983720')
				}
				if (balanceOfGoerli) {
					member.roles.add('999338334692327494')
				} else {
					member.roles.remove('999338334692327494')
				}
				await interaction.reply({
					content: `You total have *${balanceOfRinkeby} RinkebyPASS*, *${balanceOfMumbai} PolygonPASS* and *${balanceOfGoerli} GoerliPASS*.`,
				});
			} catch (e) {
				console.log(e)
				await interaction.reply({
					content: 'Error while querying balance.',
					ephemeral: true,
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
