const redisClient = require('../libs/redis.js');
const { getUser } = require('../apis/user');

const id = redisClient.get('833684848849453098-980009405401677854')
// const userInfo = (await getUser(id)).Item
console.log(id)