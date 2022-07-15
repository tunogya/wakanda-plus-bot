const { SlashCommandBuilder } = require('@discordjs/builders');
const redisClient = require('../libs/redis.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
			.setName('openai')
			.setDescription(`Call a OpenAI, default use 'text-davinci-002' model`)
			.addStringOption(option => option.setName('model').setDescription('Name of the AI model, e.g. text-davinci-002, text-curie-001, text-babbage-001, text-ada-001'))
			.addNumberOption(option => option.setName('temperature').setDescription('Control randomness of the generated text. 0.0 to 1.0.'))
			.addNumberOption(option => option.setName('top_p').setDescription('Control diversity via nucleus sampling. 0.0 to 1.0.'))
			.addIntegerOption(option => option.setName('n').setDescription('How many completions to generate for each prompt.'))
			.addBooleanOption(option => option.setName('stream').setDescription('Whether to stream back partial progress.'))
			.addStringOption(option => option.setName('suffix').setDescription('The suffix that comes after a completion of inserted text.'))
			.addBooleanOption(option => option.setName('echo').setDescription('Echo back the prompt in addition to the completion'))
			.addStringOption(option => option.setName('stop').setDescription('Where the API will stop generating further tokens'))
			.addIntegerOption(option => option.setName('max_tokens').setDescription('The maximum number of tokens to generate.'))
			.addNumberOption(option => option.setName('frequency_penalty').setDescription('How much to penalize new tokens based on their existing frequency in the text so far. 0.0 to 1.0.'))
			.addNumberOption(option => option.setName('presence_penalty').setDescription('How much to penalize new tokens based on whether they appear in the text so far. 0.0 to 1.0.'))
			.addIntegerOption(option => option.setName('best_of').setDescription('Generate multiple texts and return the best one. This can eat into token quota very quickly.')),
	async execute(interaction) {
		const model = interaction.options.getString('model') ?? 'text-davinci-002';
		const temperature = interaction.options.getNumber('temperature') ?? 1;
		const top_p = interaction.options.getNumber('top_p') ?? 1;
		const n = interaction.options.getInteger('n') ?? 1;
		const stream = interaction.options.getBoolean('stream') ?? false;
		const echo = interaction.options.getBoolean('echo') ?? false;
		const stop = interaction.options.getString('stop') ?? null;
		const suffix = interaction.options.getString('suffix') ?? null;
		const max_tokens = interaction.options.getInteger('max_tokens') ?? 256;
		const frequency_penalty = interaction.options.getNumber('frequency_penalty') ?? 0;
		const presence_penalty = interaction.options.getNumber('presence_penalty') ?? 0;
		const best_of = interaction.options.getInteger('best_of') ?? 1;
		
		if (model !== 'text-ada-001' && model !== 'text-babbage-001' && model !== 'text-curie-001' && model !== 'text-davinci-002') {
			return interaction.reply('Invalid model name. Only text-davinci-002, text-curie-001, text-babbage-001, text-ada-001 are supported.');
		}
		
		if (temperature < 0 || temperature > 1) {
			return interaction.reply({ content: 'temperature need a number between 0 and 1.', ephemeral: true });
		}
		if (top_p < 0 || top_p > 1) {
			return interaction.reply({ content: 'top_p need a number between 0 and 1.', ephemeral: true });
		}
		if (n < 0) {
			return interaction.reply({ content: 'n need a number greater than 0.', ephemeral: true });
		}
		if (max_tokens < 1 || (model !== 'text-davinci-002' && max_tokens > 2048) || (model === 'text-davinci-002' && max_tokens > 4096)) {
			return interaction.reply({
				content: 'text-davinci-002 has 4096 max tokens, and others has 2048 max tokens.',
				ephemeral: true
			});
		}
		if (frequency_penalty < -2 || frequency_penalty > 2) {
			return interaction.reply({ content: 'frequency_penalty need a number between -2 and 2.', ephemeral: true });
		}
		if (presence_penalty < -2 || presence_penalty > 2) {
			return interaction.reply({ content: 'presence_penalty need a number between -2 and 2.', ephemeral: true });
		}
		if (best_of < 1 || best_of > 10) {
			return interaction.reply({ content: 'best_of need a number between 1 and 100.', ephemeral: true });
		}
		
		// save the params to redis
		await redisClient.set(`${interaction.guildId}-${interaction.channelId}-${interaction.user.id}-intention`, JSON.stringify({
			model: model,
			temperature: temperature,
			top_p: top_p,
			max_tokens: max_tokens,
			frequency_penalty: frequency_penalty,
			presence_penalty: presence_penalty,
			best_of: best_of,
			n: n,
			stream: stream,
			echo: echo,
			stop: stop,
			suffix: suffix
		}), {
			EX: 300,
		});
		
		const embed = new MessageEmbed()
				.setTitle('Config Overview')
				.setDescription(`model: ${model}, temperature: ${temperature}, top_p: ${top_p}, max_tokens: ${max_tokens}, frequency_penalty: ${frequency_penalty}, presence_penalty: ${presence_penalty}, best_of: ${best_of}, n: ${n}, stream: ${stream}, echo: ${echo}, stop: ${stop}, suffix: ${suffix}`);
		
		await interaction.reply({
			content: 'You are about to talk to an AI bot. Tall me your prompt in 5 min or type `/cancel` to cancel.',
			embeds: [embed],
			ephemeral: true,
		});
	},
};