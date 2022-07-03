const { PutCommand, GetCommand, DeleteCommand, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const ddbDocClient = require('../libs/ddbDocClient.js');

const putUser = async (id, user_id, guild_id) => {
	const params = {
		TableName: 'wakandaplus',
		Item: {
			id: id,
			user: user_id,
			guild: guild_id,
		},
	};
	
	try {
		const data = await ddbDocClient.send(new PutCommand(params));
		console.log('Success - item added or updated', data);
	} catch (err) {
		console.log('Error', err.stack);
	}
};

const getUser = async (user, guild) => {
	const params = {
		TableName: 'wakandaplus',
		Key: {
			user: user,
			guild: guild,
		},
	};
	
	try {
		const data = await ddbDocClient.send(new GetCommand(params));
		console.log('Success :', data.Item);
	} catch (err) {
		console.log('Error', err);
	}
}

const deleteUserById = async (user, guild) => {
	const params = {
		TableName: 'wakandaplus',
		Key: {
			user: user,
			guild: guild,
		},
	};
	
	try {
		await ddbDocClient.send(new DeleteCommand(params));
		console.log('Success - item deleted');
	} catch (err) {
		console.log('Error', err);
	}
};

const addEvmCoinbaseToUser = async (id, address) => {
	// Set the parameters.
	const params = {
		TableName: 'wakandaplus',
		Key: {
			id: BigInt(id),
		},
		ExpressionAttributeNames: { '#evm': 'coinbase-evm' },
		UpdateExpression: 'ADD #evm :c',
		ExpressionAttributeValues: {
			':c': address,
		},
	};
	try {
		const data = await ddbDocClient.send(new UpdateCommand(params));
		console.log('Success - item added or updated', data);
		return data;
	} catch (err) {
		console.log('Error', err);
	}
};

const queryUser = async (user_id, guild_id) => {
	const params = {
		ExpressionAttributeNames: { '#user': 'user', '#guild': 'guild' },
		ProjectionExpression: 'id, #user, #guild',
		TableName: 'wakandaplus',
		IndexName: 'user-guild-index',
		KeyConditionExpression: '#user = :user and #guild = :guild',
		ExpressionAttributeValues: {
			':user': BigInt(user_id),
			':guild': BigInt(guild_id),
		},
	};
	
	try {
		const data = await ddbDocClient.send(new QueryCommand(params));
		console.log(data)
	} catch (err) {
		console.log('Error', err);
	}
};

module.exports = {
	putUser,
	getUser,
	deleteUserById,
}