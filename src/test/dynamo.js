const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const ddbDocClient = require('../libs/ddbDocClient.js');


const putItem = async () => {
	const params = {
		TableName: 'wakandaplus',
		Item: {
			id: 'id',
		},
	};
	
	try {
		const data = await ddbDocClient.send(new PutCommand(params));
		console.log('Success - item added or updated', data);
	} catch (err) {
		console.log('Error', err.stack);
	}
};

const getItem = async () => {
	const params = {
		TableName: 'wakandaplus',
		Key: {
			id: 'id',
		},
	};
	
	try {
		const data = await ddbDocClient.send(new GetCommand(params));
		console.log('Success :', data.Item);
	} catch (err) {
		console.log('Error', err);
	}
}

const updateItem = async () => {
	const params = {
		TableName: 'wakandaplus',
		Key: {
			id: 'id',
		},
		ProjectionExpression: '#r',
		ExpressionAttributeNames: { '#r': 'rank' },
		UpdateExpression: 'set info.plot = :p, info.#r = :r',
		ExpressionAttributeValues: {
			':p': 'MOVIE_PLOT',
			':r': 'MOVIE_RANK',
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

const deleteItem = async () => {
	const params = {
		TableName: 'wakandaplus',
		Key: {
			id: 'id',
		},
	};
	
	try {
		const data = await ddbDocClient.send(new DeleteCommand(params));
		console.log('Success - item deleted');
		console.log(data)
	} catch (err) {
		console.log('Error', err);
	}
};

const queryTable = async () => {
	const params = {
		ExpressionAttributeNames: { '#r': 'rank', '#y': 'year', '#t': 'title' },
		ProjectionExpression: '#r, #y, #t',
		TableName: 'wakandaplus',
		ExpressionAttributeValues: {
			':t': 'MOVIE_NAME',
			':y': 'MOVIE_YEAR',
			':r': 'MOVIE_RANK',
		},
		KeyConditionExpression: '#t = :t and #y = :y',
		FilterExpression: 'info.#r = :r',
	};
	try {
		const data = await ddbDocClient.send(new QueryCommand(params));
		for (let i = 0; i < data.Items.length; i++) {
			console.log(
				'Success. Items with rank of ' +
				'MOVIE_RANK' +
				' include\n' +
				'Year = ' +
				data.Items[i].year +
				' Title = ' +
				data.Items[i].title,
			);
		}
	} catch (err) {
		console.log('Error', err);
	}
};

// putItem();
// getItem();
// updateItem();
// deleteItem();
queryTable();