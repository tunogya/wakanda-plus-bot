const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const redisClient = require("./libs/redis.js");
const dotenv = require('dotenv');
dotenv.config();

const wait = require('node:timers/promises').setTimeout;

try {
	redisClient.connect();
} catch (e) {
	console.log('Redis Client Connect Error')
}

const token = process.env.token;

const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

bot.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	bot.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	} else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}

bot.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = bot.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true,
		});
	}
});

bot.on('interactionCreate', async (interaction) => {
	if (!interaction.isButton()) return;
	const filter = i => i.customId === '0x3B0D70a7e46390a066DB559cD17a455D68602cDC';
	const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
	collector.on('collect', async i => {
		if (i.customId === 'primary') {
			await i.deferUpdate();
			await wait(4000);
			await i.editReply({ content: 'A button was clicked!', components: [] });
		}
	});
	
	collector.on('end', collected => console.log(`Collected ${collected.size} items`));
})

bot.login(token);
