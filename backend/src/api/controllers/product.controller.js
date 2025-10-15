
const db = require('../../config/db');
const productService = require('../../services/product.service');

// Get all products, using cache
exports.getProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// Get a single product by ID with its associated reviews
exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productQuery = 'SELECT id, name, category, price, cost_price as "costPrice", description, images, variants, stock FROM products WHERE id = $1';
        const productResult = await db.query(productQuery, [id]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const product = productResult.rows[0];

        const reviewsQuery = `
            SELECT id, user_id, author_name as author, rating, comment, is_hidden as "isHidden", created_at as date 
            FROM reviews 
            WHERE product_id = $1 
            ORDER BY created_at DESC
        `;
        const reviewsResult = await db.query(reviewsQuery, [id]);
        product.reviews = reviewsResult.rows;

        res.json(product);
    } catch (error) {
        next(error);
    }
};

// Add a review to a product
exports.addProductReview = async (req, res, next) => {
    try {
        const { id: productId } = req.params;
        const { userId, role } = req.user; // from authenticate middleware
        const { author, rating, comment } = req.body;

        const query = `
            INSERT INTO reviews (product_id, user_id, author_name, rating, comment)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, author_name as author, rating, comment, is_hidden as "isHidden", created_at as date;
        `;
        const { rows } = await db.query(query, [productId, userId, author, rating, comment]);
        
        res.status(201).json(rows[0]);
    } catch (error) {
        next(error);
    }
};
