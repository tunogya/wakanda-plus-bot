const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { dynamo } = require('../dynamodb.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinbase')
		.setDescription('Get member\'s coinbase')
		.addUserOption(option => option.setName('target').setDescription('The member to query')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		const params = {
			'user_id': user.id,
			'guild_id': interaction.guild?.id ?? null,
		};
		
		await dynamo.get(params, function(err, data) {
			if (err) console.log(err, err.stack)
			else console.log(data)
		});
		
		const embed = new MessageEmbed()
			.setTitle('Privacy Policy')
			.setDescription('You can query the coinbase of any members, and so can others.\nYou can update your coinbase with the /verify command. We can only bind one of your Ethereum address, however, you can bind one Flow address at the same time.')
		
		await interaction.reply({ content: `${user.tag}'s Coinbase: \n Ethereum: `, embeds: [embed], ephemeral: true });
	},
};
