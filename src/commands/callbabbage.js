const { SlashCommandBuilder } = require('@discordjs/builders');
const redisClient = require('../libs/redis.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('callbabbage')
		.setDescription(`Call Babbage`)
		.addIntegerOption(option => option.setName('temperature').setDescription('Control randomness of the generated text. 0.0 to 1.0.'))
		.addIntegerOption(option => option.setName('top_p').setDescription('Control diversity via nucleus sampling. 0.0 to 1.0.'))
		.addIntegerOption(option => option.setName('max_tokens').setDescription('The maximum number of tokens to generate.'))
		.addIntegerOption(option => option.setName('frequency_penalty').setDescription('How much to penalize new tokens based on their existing frequency in the text so far.'))
		.addIntegerOption(option => option.setName('presence_penalty').setDescription('How much to penalize new tokens based on whether they appear in the text so far.'))
		.addIntegerOption(option => option.setName('best_of').setDescription('Generate multiple texts and return the best one. This can eat into token quota very quickly.')),
	async execute(interaction) {
		const temperature = interaction.getInteger('temperature') ?? Math.random();
		const top_p = interaction.getInteger('top_p') ?? Math.random();
		const max_tokens = interaction.getInteger('max_tokens') ?? 100;
		const frequency_penalty = interaction.getInteger('frequency_penalty') ?? Math.random();
		const presence_penalty = interaction.getInteger('presence_penalty') ?? Math.random();
		const best_of = interaction.getInteger('best_of') ?? 1;
		
		if (temperature < 0 || temperature > 1) {
			return interaction.reply({ content: 'You need to input a number between 0 and 1.', ephemeral: true });
		}
		if (top_p < 0 || top_p > 1) {
			return interaction.reply({ content: 'You need to input a number between 0 and 1.', ephemeral: true });
		}
		if (max_tokens < 1 || max_tokens > 100) {
			return interaction.reply({ content: 'You need to input a number between 1 and 100.', ephemeral: true });
		}
		if (frequency_penalty < 0 || frequency_penalty > 1) {
			return interaction.reply({ content: 'You need to input a number between 0 and 1.', ephemeral: true });
		}
		if (presence_penalty < 0 || presence_penalty > 1) {
			return interaction.reply({ content: 'You need to input a number between 0 and 1.', ephemeral: true });
		}
		if (best_of < 1 || best_of > 10) {
			return interaction.reply({ content: 'You need to input a number between 1 and 100.', ephemeral: true });
		}
		
		// save the params to redis
		await redisClient.set(`${interaction.user.channelId}-${interaction.user.id}-intent`, JSON.stringify({
			model: 'babbage',
			temperature: temperature,
			top_p: top_p,
			max_tokens: max_tokens,
			frequency_penalty: frequency_penalty,
			presence_penalty: presence_penalty,
			best_of: best_of,
		}), {
			EX: 300,
		});
		
		const embed = new MessageEmbed()
			.setTitle('Payment Overview')
			.setDescription(
				`model: Babbage\ntemperature: ${temperature}\ntop_p: ${top_p}\nmax_tokens: ${max_tokens}\nfrequency_penalty: ${frequency_penalty}\npresence_penalty: ${presence_penalty}\nbest_of: ${best_of}`
			);
		
		await interaction.reply({
			content: 'Ok, please input your prompt in 5 min or type `/cancel` to cancel.',
			embeds: [embed],
			ephemeral: true,
		});
	},
};