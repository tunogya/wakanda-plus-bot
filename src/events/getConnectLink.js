import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import client from '../redis'

export const interactionCreate = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isButton()) return;
		if (interaction.customId === 'getConnectLink') {
			// const channelId = interaction.channelId;
			const member = interaction.user.id;
			const guild = interaction.guild?.id ?? null;
			
			await client.set('123456', 'wakanda', {
				EX: 300,
			})
			
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setLabel('Connect Wallet')
						.setURL(`https://api.wakanda-labs.com/discord?state=${123456}`)
						.setStyle('LINK'),
				);
			const embed = new MessageEmbed()
				.setTitle('Please read instructions carefully before connecting')
				.setDescription('You should expect to sign the following message when prompted by a non-custodial wallet such as MetaMask:')
				.setFooter('Make sure you sign the EXACT message (some wallets may use \\n for new lines) and NEVER share your seed phrase or private key.');
			
			await interaction.reply({
				content: `Use this custom link to connect (valid for 5 minutes)\nGuild: ${guild} Member: ${member}`,
				components: [row], embeds: [embed], ephemeral: true,
			});
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};