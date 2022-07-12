const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv');
dotenv.config();

const configuration = new Configuration({
	organization: "org-rxTZqP3Xo69kKrX2KGvFxZly",
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = openai;