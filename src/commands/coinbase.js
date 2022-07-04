const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const redisClient = require('../libs/redis.js');
const { getUser } = require('../apis/user.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinbase')
		.setDescription('Get member\'s coinbase')
		.addUserOption(option => option.setName('target').setDescription('The member to query')),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setTitle('Privacy Policy')
			.setDescription('You can query the coinbase of any members, and so can others.\nYou can update your coinbase with the /verify command.')
		
		const user = interaction.options.getUser('target');
		const id = await redisClient.get(`${user.id}-${interaction.guild?.id ?? 0}`)
		if (id) {
			const q = await getUser(id)
			const info = q.Item
			if (info) {
				const coinbaseEvm = Array.from(info['coinbase-evm'])
				await interaction.reply({ content: `### ${user.username}'s coinbase:
Ethereum:
- ${coinbaseEvm.join(' - ')}
`, embeds: [embed], ephemeral: true });
			}
		} else {
			await interaction.reply({ content: `${user.username} has no coinbase.`, embeds: [embed], ephemeral: true });
		}
	},
};
