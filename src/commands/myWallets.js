const { SlashCommandBuilder } = require('@discordjs/builders');
const redisClient = require('../libs/redis.js');
const { getUser } = require('../dynamodb/wakandaplus.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { shortenAddress } = require('../utils/address');
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');
const ddbDocClient = require('../libs/ddbDocClient.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mywallets')
		.setDescription('Manage your wallets'),
	async execute(interaction) {
		let id = await redisClient.get(interaction.user.id);
		let info;
		if (!id) {
			const res = await ddbDocClient.send(new QueryCommand({
				ExpressionAttributeNames: { '#user': 'user' },
				ProjectionExpression: 'id, #user',
				TableName: 'wakandaplus',
				IndexName: 'user-index',
				KeyConditionExpression: '#user = :user',
				ExpressionAttributeValues: {
					':user': BigInt(interaction.user.id),
				},
			}));
			if (res.Count > 0) {
				id = res.Items[0].id;
				await redisClient.set(
					interaction.user.id,
					id.toString(),
					{
						EX: 86400,
					},
				);
			}
		}
		if (id) {
			const q = await getUser(id);
			info = q.Item;
		}
		if (id && info) {
			const wallets = info['wallets'] ? Array.from(info['wallets']) : [];
			const row = new MessageActionRow().addComponents(
				wallets.slice(0, 4).map((address) => new MessageButton()
					.setCustomId(address)
					.setLabel(shortenAddress(address))
					.setStyle('SECONDARY')
				).concat(wallets.length > 4 ?
					[new MessageButton()
						.setCustomId('next')
						.setLabel('»')] : []
				)
			);
			await interaction.reply({
				content: 'Choose a wallet from the list below:',
				components: [row],
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'None user info.',
				ephemeral: true,
			});
		}
	},
};
