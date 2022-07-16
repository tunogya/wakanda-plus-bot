const openai = require('../libs/openai')

const fetch = async () => {
	openai.createCompletion({
		model: 'text-davinci-002',
		prompt: 'What is the meaning of life?',
		temperature: 0.9,
		top_p: 1,
		max_tokens: 100,
		frequency_penalty: 0,
		presence_penalty: 0.6,
		n: 1,
		best_of: 1,
		suffix: null,
		echo: true,
		stream: true,
	}).then(res => {
		console.log(res)
	})
}

const listModel = async () => {
	const res = await openai.listModels();
	console.log(res.data.data.map(item => item.id));
}

fetch()