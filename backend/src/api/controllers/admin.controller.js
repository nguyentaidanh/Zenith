
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const productService = require('../../services/product.service');

// --- Dashboard ---
exports.getAdminStats = async (req, res, next) => {
    try {
        const statsQueries = [
            db.query('SELECT SUM(total_amount) as "totalRevenue" FROM orders WHERE status = \'Delivered\''),
            db.query('SELECT COUNT(*) as "totalOrders" FROM orders'),
            db.query('SELECT COUNT(*) as "totalProducts" FROM products'),
            db.query('SELECT COUNT(*) as "totalUsers" FROM users'),
        ];
        const results = await Promise.all(statsQueries);
        res.json({
            totalRevenue: parseFloat(results[0].rows[0].totalRevenue) || 0,
            totalOrders: parseInt(results[1].rows[0].totalOrders, 10) || 0,
            totalProducts: parseInt(results[2].rows[0].totalProducts, 10) || 0,
            totalUsers: parseInt(results[3].rows[0].totalUsers, 10) || 0,
        });
    } catch (error) {
        next(error);
    }
};

// --- Product Management ---
exports.createProduct = async (req, res, next) => {
    try {
        const { name, category, price, costPrice, description, stock, images, variants } = req.body;
        const query = `
            INSERT INTO products (name, category, price, cost_price, description, stock, images, variants)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const { rows } = await db.query(query, [name, category, price, costPrice, description, stock, images || [], variants || []]);
        await productService.invalidateProductsCache();
        res.status(201).json(rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, category, price, costPrice, description, stock, images, variants } = req.body;
        const query = `
            UPDATE products SET 
                name = $1, category = $2, price = $3, cost_price = $4, description = $5, stock = $6, images = $7, variants = $8
            WHERE id = $9
            RETURNING *;
        `;
        const { rows } = await db.query(query, [name, category, price, costPrice, description, stock, images, variants, id]);
        await productService.invalidateProductsCache();
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM products WHERE id = $1', [id]);
        await productService.invalidateProductsCache();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// --- Order Management ---
exports.getAdminOrders = async (req, res, next) => {
    try {
        const query = `
            SELECT id, customer_name as "customerName", created_at as date, total_amount as total, status
            FROM orders ORDER BY created_at DESC
        `;
        const { rows } = await db.query(query);
        // Ensure id is a string to match frontend type
        const orders = rows.map(o => ({ ...o, id: o.id.toString() }));
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const query = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *;';
        const { rows } = await db.query(query, [status, id]);
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

// --- User Management ---
exports.getAdminUsers = async (req, res, next) => {
    try {
        const query = `
            SELECT u.id, u.name, u.email, u.phone, u.role, COUNT(o.id) as order_count
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            GROUP BY u.id
            ORDER BY u.name;
        `;
        const { rows } = await db.query(query);
        // Remap to match frontend User type which expects `orders` array
        const users = rows.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            orders: Array(parseInt(u.order_count, 10)).fill({}) // Mock array of correct length
        }));
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.resetUserPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newPassword = 'password123'; // In a real app, generate a random one
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);
        await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, id]);
        console.log(`Password for user ${id} reset to: ${newPassword}`);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// --- Review Management ---
exports.getAdminReviews = async (req, res, next) => {
    try {
        const query = `
            SELECT
                r.id, r.author_name as author, r.rating, r.comment, r.created_at as date, r.is_hidden as "isHidden",
                p.id as "productId", p.name as "productName", p.images[1] as "productImage"
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            ORDER BY r.created_at DESC;
        `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

exports.toggleReviewVisibility = async (req, res, next) => {
    try {
        const { reviewId } = req.body;
        const query = 'UPDATE reviews SET is_hidden = NOT is_hidden WHERE id = $1 RETURNING *;';
        const { rows } = await db.query(query, [reviewId]);
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};
