import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export const verify = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Verify your crypto assets'),
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('getConnectLink')
					.setLabel('Let\'s go')
					.setStyle('PRIMARY'),
			);
		const embed = new MessageEmbed()
			.setTitle('Verify your assets')
			.setDescription('This is a read-only connection. Do not share your private keys. We will never ask for your seed phrase. We will never DM you.');
		
		await interaction.reply({ components: [row], embeds: [embed], ephemeral: true });
	},
};
