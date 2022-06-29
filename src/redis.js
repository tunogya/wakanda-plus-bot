const dotenv = require('dotenv');
dotenv.config();
const { createClient } = require('redis');

const client = new createClient({
	url: process.env.REDIS_URL,
})

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

module.exports = client;