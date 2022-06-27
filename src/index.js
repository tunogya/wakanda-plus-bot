const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const token = process.env.token;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
	if (interaction.customId === 'verify') {
		// const channelId = interaction.channelId;
		const member = interaction.user.id;
		const guild = interaction.guild.id;
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('connect wallet')
					.setLabel('Connect Wallet')
					.setURL('')
					.setStyle('LINK'),
			);
		const embed = new MessageEmbed()
			.setTitle('Please read instructions carefully before connecting')
			.setDescription('You should expect to sign the following message when prompted by a non-custodial wallet such as MetaMask:');
		await interaction.reply({ content: `Use this custom link to connect (valid for 5 minutes)\nGuild: ${guild} Member: ${member}`,
			components: [row], embed: [embed], ephemeral: true });
	}
	else {
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
