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
				for (const addr of wallets.filter(address => isAddress(address))) {
					const [polygonBalance] = await Promise.all([
						polygonPassContract.balanceOf(addr),
					]);
					balanceOfPolygon += polygonBalance.toNumber();
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
					content: 'Do not wary, it is not your fail. Something was wrong while querying the data in etherscan.',
					ephemeral: true,
				});
			}
		} else {
			await interaction.reply({
				content: `${member.displayName} did not link any wallet to Wakanda.`,
				ephemeral: true,
			});
		}
	},
};
