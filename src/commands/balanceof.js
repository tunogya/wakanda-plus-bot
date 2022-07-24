const { SlashCommandBuilder } = require('@discordjs/builders');
const { getIdByUserId, getUser } = require("../dynamodb/wakandaplus");
const { isAddress } = require("../utils/address");
const ethers = require("ethers");
const { WAKANDAPASS_ADDRESS } = require("../constant/address");
const SupportedChainId = require("../constant/chains");
const geohash_abi = require("../abis/geohash.json");
const { GoerliProvider } = require("../libs/web3");

module.exports = {
	data: new SlashCommandBuilder()
			.setName('balanceof')
			.setDescription('Get PASS balance of a member')
			.addUserOption(option => option.setName('member').setDescription('Target member')),
	async execute(interaction) {
		const member = interaction.options.getMember('member') ?? interaction.member;
		const id = await getIdByUserId(member.id);
		if (id !== undefined) {
			const q = await getUser(id);
			const info = q.Item;
			try {
				const wallets = Array.from(info.wallets);
				const goerliPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.GOERLI], geohash_abi, GoerliProvider)
				let balanceOfGoerli = 0;
				let tokenURIOfGoerli = [];
				for (const addr of wallets.filter(address => isAddress(address))) {
					let tokenIdOfGoerli = [];
					// query balance of address
					const [goerliBalance] = await Promise.all([
						goerliPassContract.balanceOf(addr),
					]);
					if (goerliBalance) {
						balanceOfGoerli += goerliBalance.toNumber();
						let tokenIdOfGoerliPromise = [];
						let tokenURIOfGoerliPromise = [];
						for (let i = 0; i < goerliBalance.toNumber(); i++) {
							tokenIdOfGoerliPromise.push(goerliPassContract.tokenOfOwnerByIndex(addr, i));
						}
						tokenIdOfGoerli = await Promise.all(tokenIdOfGoerliPromise);
						for (let i = 0; i < goerliBalance.toNumber(); i++) {
							tokenURIOfGoerliPromise.push(goerliPassContract.tokenURI(tokenIdOfGoerli[i]));
						}
						const tokenURI = await Promise.all(tokenURIOfGoerliPromise);
						tokenURIOfGoerli = [...tokenURIOfGoerli, ...tokenURI]
					}
				}
				if (balanceOfGoerli) {
					member.roles.add('999338334692327494')
				} else {
					member.roles.remove('999338334692327494')
				}
				await interaction.reply({
					content: `${member.displayName.toUpperCase()} total have *${balanceOfGoerli} GoerliPASS*. They are: ${tokenURIOfGoerli.map((item) => `#${item}`).join(', ')}
					
> Note: Use */balanceof Wakanda+* command can query the PASS which are NO MAN'S LAND. And then you can got them by */portal* command luckily.`,
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
				content: `${member.displayName} is not a member of Wakanda.`,
				ephemeral: true,
			});
		}
	},
};
