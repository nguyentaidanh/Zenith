
const db = require('../config/db');
const redisClient = require('../config/redis');

const CACHE_KEY_PRODUCTS = 'products:all';
const CACHE_EXPIRATION_SECONDS = 3600; // Cache for 1 hour

const getProductsFromDb = async () => {
    const { rows } = await db.query('SELECT *, cost_price as "costPrice" FROM products ORDER BY id ASC');
    return rows;
};

const getAllProducts = async () => {
    if (!redisClient.isReady) {
         console.log("Redis not ready, fetching directly from DB.");
         return getProductsFromDb();
    }
    try {
        const cachedData = await redisClient.get(CACHE_KEY_PRODUCTS);
        if (cachedData) {
            console.log("Serving products from cache.");
            return JSON.parse(cachedData);
        }
    } catch (error) {
        console.error("Redis GET error:", error);
    }

    console.log("Serving products from DB and setting cache.");
    const products = await getProductsFromDb();
    
    try {
        await redisClient.setEx(CACHE_KEY_PRODUCTS, CACHE_EXPIRATION_SECONDS, JSON.stringify(products));
    } catch (error) {
        console.error("Redis SETEX error:", error);
    }

    return products;
};

const invalidateProductsCache = async () => {
     if (!redisClient.isReady) return;
    try {
        await redisClient.del(CACHE_KEY_PRODUCTS);
        console.log("Products cache invalidated.");
    } catch (error) {
        console.error("Redis DEL error:", error);
    }
};

module.exports = {
    getAllProducts,
    invalidateProductsCache
};
