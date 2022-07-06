const { getUser } = require('../dynamodb/wakandaplus');


const test = async () => {
	const res = (await getUser('1260573660549120')).Item
	console.log(res)
}

test()