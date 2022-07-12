module.exports = {
	name: 'interactionCreate',
	async execute(message, interaction) {
		if (message.author.bot) return;
		console.log(message.channelId);
		console.log(message.guildId);
		console.log(message.content);
		console.log(message.author.id);
		interaction.reply(`${message.channelId}, ${message.guildId}, ${message.content}, ${message.author.id}`);
	}
}