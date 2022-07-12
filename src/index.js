const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const redisClient = require("./libs/redis.js");
const dotenv = require('dotenv');
dotenv.config();

try {
	redisClient.connect();
} catch (e) {
	console.log('Redis Client Connect Error')
}

const token = process.env.token;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.log(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true,
		});
	}
});


client.on('messageCreate', (message) => {
	console.log(message);
	if (message.author?.bot) return;
	if (message.guildId !== '980009405401677854') return;
	if (message.channelId === '996278471422660688') {
		message.reply({
			content: 'davinci',
		});
	} else if (message.channelId === '996280015379509288') {
		message.reply({
			content: 'curie',
		})
	} else if (message.channelId === '996280421283266733') {
		message.reply({
			content: 'babbage',
		})
	} else if (message.channelId === '996280490237632622') {
		message.reply({
			content: 'ada',
		})
	}
});

client.login(token);
