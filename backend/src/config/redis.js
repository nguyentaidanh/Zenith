
const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('connect', () => console.log('Connecting to Redis...'));
redisClient.on('ready', () => console.log('Connected to Redis successfully.'));
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('end', () => console.log('Redis connection ended.'));

// Immediately connect to Redis
redisClient.connect().catch(console.error);

module.exports = redisClient;
