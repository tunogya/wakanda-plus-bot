const { SlashCommandBuilder } = require('@discordjs/builders');
const { getIdByUserId, getUser } = require("../dynamodb/wakandaplus");
const { isAddress } = require("../utils/address");
const ethers = require("ethers");
const { WAKANDAPASS_ADDRESS } = require("../constant/address");
const SupportedChainId = require("../constant/chains");
const geohash_abi = require("../abis/geohash.json");
const { PolygonProvider, GoerliProvider } = require("../libs/web3");

module.exports = {
	data: new SlashCommandBuilder()
			.setName('balanceof')
			.setDescription('Get PASS balance of a member')
			.addUserOption(option => option.setName('member').setDescription('Target member')),
	async execute(interaction) {
		const member = interaction.options.getMember('member') ?? interaction.member;
		const id = await getIdByUserId(member.id);
		if (id !== null) {
			const q = await getUser(id);
			const info = q.Item;
			try {
				const wallets = Array.from(info.wallets);
				const polygonPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.POLYGON], geohash_abi, PolygonProvider)
				const goerliPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.GOERLI], geohash_abi, GoerliProvider)
				let balanceOfPolygon = 0, balanceOfGoerli = 0;
				let tokenURIOfPolygon = [], tokenURIOfGoerli = [];
				for (const addr of wallets.filter(address => isAddress(address))) {
					// query balance of address
					const [polygonBalance, goerliBalance] = await Promise.all([
						polygonPassContract.balanceOf(addr),
						goerliPassContract.balanceOf(addr),
					]);
					if (polygonBalance.toNumber() > 0) {
						balanceOfPolygon += polygonBalance.toNumber();
						let tokenIdPromises = [];
						for (let i = 0; i < polygonBalance.toNumber(); i++) {
							tokenIdPromises.push(polygonPassContract.tokenOfOwnerByIndex(addr, i));
						}
						const tokenIds = await Promise.all(tokenIdPromises);
						const tokenURIPromises = tokenIds.map((tokenId) => polygonPassContract.tokenURI(tokenId))
						const tokenURIs = await Promise.all(tokenURIPromises);
						tokenURIOfPolygon = [...tokenURIOfPolygon, ...tokenURIs]
					}
					if (goerliBalance.toNumber() > 0) {
						balanceOfGoerli += goerliBalance.toNumber();
						let tokenIdPromises = [];
						for (let i = 0; i < goerliBalance.toNumber(); i++) {
							tokenIdPromises.push(goerliPassContract.tokenOfOwnerByIndex(addr, i));
						}
						const tokenIds = await Promise.all(tokenIdPromises);
						const tokenURIPromises = tokenIds.map((tokenId) => goerliPassContract.tokenURI(tokenId))
						const tokenURIs = await Promise.all(tokenURIPromises);
						tokenURIOfGoerli = [...tokenURIOfGoerli, ...tokenURIs]
					}
				}
				if (balanceOfGoerli) {
					member.roles.add('999338334692327494')
				} else {
					member.roles.remove('999338334692327494')
				}
				if (balanceOfPolygon) {
					member.roles.add('1000792723080609843')
				} else {
					member.roles.remove('1000792723080609843')
				}
				await interaction.reply({
					content: `${member.displayName.toUpperCase()} have *${balanceOfPolygon} PolygonPASS*. ${(balanceOfPolygon > 0) ? (`They are: ${tokenURIOfPolygon.map((tokenURI) => `#${tokenURI}`).join(', ')}.`) : ''}
${(`${member.displayName.toUpperCase()} have *${balanceOfGoerli} GoerliPASS*. ${(balanceOfGoerli > 0) ? (`They are: ${tokenURIOfGoerli.map((tokenURI) => `#${tokenURI}`).join(', ')}.`) : ''}`)}
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
