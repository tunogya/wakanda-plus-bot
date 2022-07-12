const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
dotenv.config();

const clientId = process.env.clientId;
const guildId = process.env.guildId;
const token = process.env.token;

const commands = [];
const guildCommands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));
const guildCommandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.guild.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

for (const file of guildCommandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	guildCommands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest
	.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.log);

rest
	.put(Routes.applicationGuildCommands(clientId, guildId), {
		body: guildCommands,
	})
	.then(() =>
		console.log('Successfully registered application guild commands.')
	)
	.catch(console.log);
