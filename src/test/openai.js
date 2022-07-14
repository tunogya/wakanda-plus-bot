const openai = require('../libs/openai')

const fetch = async () => {
	const res = await openai.createCompletion({
		model: 'text-davinci-002',
		prompt: 'What is the meaning of life?',
		temperature: 0.9,
		top_p: 1,
		max_tokens: 100,
		frequency_penalty: 0,
		presence_penalty: 0.6,
	});
	console.log(res)
	// console.log(res.config.headers['OpenAI-Organization'])
}

fetch()