const { SlashCommandBuilder } = require('@discordjs/builders');
const { getIdByUserId, getUser } = require("../dynamodb/wakandaplus");
const { isAddress } = require("../utils/address");
const ethers = require("ethers");
const { WAKANDAPASS_ADDRESS } = require("../constant/address");
const SupportedChainId = require("../constant/chains");
const wakandapass_abi = require("../abis/wakandapass.json");
const { PolygonProvider } = require("../libs/web3");

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
				const polygonPassContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.POLYGON], wakandapass_abi, PolygonProvider)
				let balanceOfPolygon = 0;
				let tokenURIOfPolygon = [];
				for (const addr of wallets.filter(address => isAddress(address))) {
					// query balance of address
					const [polygonBalance] = await Promise.all([
						polygonPassContract.balanceOf(addr),
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
				}
				if (balanceOfPolygon) {
					member.roles.add('1000792723080609843')
				} else {
					member.roles.remove('1000792723080609843')
				}
				await interaction.reply({
					content: `${member.displayName.toUpperCase()} have *${balanceOfPolygon} PolygonPASS*.

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
