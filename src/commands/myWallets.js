const { SlashCommandBuilder } = require('@discordjs/builders');
const redisClient = require('../libs/redis.js');
const { getUser } = require('../apis/user.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mywallets')
		.setDescription('Manage your wallets'),
	async execute(interaction) {
		const user = interaction.user;
		// 通过缓存查询用户的雪花号
		const id = await redisClient.get(user.id)
		if (id) {
			const q = await getUser(id)
			const info = q.Item
			if (info) {
				const wallets = info['wallets'] ? Array.from(info['wallets']) : []
				// 换成罗列用户的所有地址，并可以对其进行管理
				await interaction.reply({ content: `${user.username}'s wallets are here.

${wallets.length > 0 ? (`${wallets.join('\n')}`) : 'None address here.'}
`, ephemeral: true });
			}
		} else {
			// 通过数据库查询是否真的没有用户数据
			// 如果没有，则创建新的用户记录
			await interaction.reply({ content: 'None address here.', ephemeral: true });
		}
	},
};
