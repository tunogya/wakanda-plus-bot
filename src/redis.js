import dotenv from 'dotenv';
import { createClient } from 'redis';
dotenv.config();


export const client = new createClient({
	url: process.env.REDIS_URL,
})

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();