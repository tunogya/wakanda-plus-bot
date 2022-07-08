const {
	PutCommand,
	GetCommand,
	DeleteCommand,
	QueryCommand,
	UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');
const ddbDocClient = require('../libs/ddbDocClient.js');
const log = require("../libs/log.js")

// 用于创建用户存档，危险！会覆盖其他字段，更新使用 Update
const putUser = async (id, user_id, guild_id) => {
	const params = {
		TableName: 'wakandaplus',
		Item: {
			id: BigInt(id),
			user: BigInt(user_id),
			guild: BigInt(guild_id),
		},
	};

	try {
		const data = await ddbDocClient.send(new PutCommand(params));
		log.info('Success - item added or updated:\n', data)
		return data;
	} catch (err) {
		log.error('Error', err.stack)
		return false;
	}
};

// 查询用户信息
const getUser = async (id) => {
	const params = {
		TableName: 'wakandaplus',
		Key: {
			id: BigInt(id),
		},
	};

	try {
		return await ddbDocClient.send(new GetCommand(params));
	} catch (err) {
		log.error('Error', err.stack)
		return false;
	}
};

const deleteUserById = async (user_id, guild_id) => {
	const params = {
		TableName: 'wakandaplus',
		Key: {
			user: BigInt(user_id),
			guild: BigInt(guild_id),
		},
	};

	try {
		await ddbDocClient.send(new DeleteCommand(params));
		log.info('Success - item deleted')
		return true;
	} catch (err) {
		log.error('Error:', err)
		return false;
	}
};

const addWalletToUser = async (id, address) => {
	// Set the parameters.
	const params = {
		TableName: 'wakandaplus',
		Key: {
			id: BigInt(id),
		},
		ExpressionAttributeNames: { '#wallet': 'wallet' },
		UpdateExpression: 'ADD #wallet :w',
		ExpressionAttributeValues: {
			':w': address,
		},
	};
	try {
		const data = await ddbDocClient.send(new UpdateCommand(params));
		log.info('Success - item added or updated:\n', data);
		return data;
	} catch (err) {
		log.error('Error:', err);
		return false;
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
		log.info(data);
		return data;
	} catch (err) {
		log.info('Error:', err);
		return false;
	}
};

module.exports = {
	putUser,
	getUser,
	deleteUserById,
	queryUser,
	addEvmCoinbaseToUser: addWalletToUser,
};
