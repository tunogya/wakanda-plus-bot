const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const client = require('../libs/redis.js');
const randomString = require('../utils/randomString.js');
const { isAddress, shortenAddress } = require('../utils/address');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isButton()) return;
		const filter = i => i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
		collector.on('collect', async i => {
			if (i.customId === 'toConnectWallet') {
				const user = i.user.id;
				const state = randomString(12);
				const message = `My discord is ${i.user.tag} and i want to connect my wallet in Wakanda Metaverse. ${new Date().toISOString()}`
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
					.setTitle('Please read instructions carefully before connecting')
					.setDescription(
						'You should expect to sign the following message when prompted by a non-custodial wallet such as MetaMask.\nMake sure you sign the EXACT message and NEVER share your seed phrase or private key.'
					);
				
				await i.reply({
					content: message,
					components: [row],
					embeds: [embed],
					ephemeral: true,
				});
			}
			else if (isAddress(i.customId)) {
				await i.update({
					content: `You select ${shortenAddress(i.customId)}`,
					components: [],
					ephemeral: true
				})
			}
		});
		
		collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	},
};
