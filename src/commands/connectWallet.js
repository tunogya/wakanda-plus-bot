const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const randomString = require('../utils/randomString.js');
const client = require('../libs/redis.js');
const { setTimeout: wait } = require('node:timers/promises');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connectwallet')
		.setDescription('Connect a new wallet'),
	async execute(interaction) {
		const user = interaction.user.id;
		const state = randomString(12);
		const message = `My discord is ${interaction.user.tag} and i want to connect my wallet in Wakanda Metaverse. ${new Date().toISOString()}`
		await client.set(
			state,
			JSON.stringify({
				user: user,
				message: message
			}),
			{
				EX: 300,
			}
		);
		
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel('Connect Wallet')
				.setURL(`https://wakandaplus.wakanda.cn/#/${state}`)
				.setStyle('LINK')
		);
		const embed = new MessageEmbed()
			.setTitle('Please connect your wallet in 5 min.')
			.setDescription(
				'You should expect to sign the following message when prompted by a non-custodial wallet such as MetaMask.\nMake sure you sign the EXACT message and NEVER share your seed phrase or private key.'
			);
		
		await interaction.reply({
			content: message,
			components: [row],
			embeds: [embed],
			ephemeral: true,
		});
	}
};
