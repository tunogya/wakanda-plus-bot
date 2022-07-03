const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ddbDocClient = require('../libs/ddbDocClient.js');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinbase')
		.setDescription('Get member\'s coinbase')
		.addUserOption(option => option.setName('target').setDescription('The member to query')),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setTitle('Privacy Policy')
			.setDescription('You can query the coinbase of any members, and so can others.\nYou can update your coinbase with the /verify command. We can only bind one of your Ethereum address, however, you can bind one Flow address at the same time.')
		
		const user = interaction.options.getUser('target');
		const params = {
			TableName: 'wakandaplus-users',
			Key: {
				user: user,
				guild: interaction.guild?.id ?? null,
			},
		};
		try {
			const data = await ddbDocClient.send(new GetCommand(params));
			console.log('Success :', data.Item);
		} catch (err) {
			console.log('Error', err);
		}
	},
};
