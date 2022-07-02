const dynamo = require('../lib/dynamodb.js');

dynamo.get(
	{
		TableName: 'wakandapass-users',
		Key: '833684848849453098',
	},
	function(err, data) {
		if (err) {
			console.log(err, err.stack);
		}
		else {
			console.log(data)
		}
	},
)