
const db = require('../../config/db');

// Create a new order (transactional)
exports.createOrder = async (req, res, next) => {
    const client = await db.getClient();
    try {
        const { userId } = req.user;
        const { items, total, shippingAddress, customerName, customerEmail } = req.body;

        await client.query('BEGIN');

        const orderQuery = `
            INSERT INTO orders (user_id, total_amount, shipping_address, customer_name, customer_email, status)
            VALUES ($1, $2, $3, $4, $5, 'Pending')
            RETURNING id, created_at as date, status;
        `;
        const orderResult = await client.query(orderQuery, [userId, total, shippingAddress, customerName, customerEmail]);
        const newOrderHeader = orderResult.rows[0];

        const itemInsertQuery = `
            INSERT INTO order_items (order_id, product_id, quantity, price_per_unit, selected_variant)
            VALUES ($1, $2, $3, $4, $5);
        `;

        for (const item of items) {
            await client.query(itemInsertQuery, [
                newOrderHeader.id,
                item.id,
                item.quantity,
                item.price,
                item.selectedVariant || null
            ]);
        }

        await client.query('COMMIT');

        const finalOrder = {
            id: newOrderHeader.id.toString(), // Frontend expects string
            date: newOrderHeader.date,
            items,
            total,
            status: newOrderHeader.status,
            shippingAddress,
            customerName,
            customerEmail,
        };

        res.status(201).json(finalOrder);
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// Get orders for the currently authenticated user
exports.getUserOrders = async (req, res, next) => {
    try {
        const { userId } = req.user;

        // 1. Get all orders for the user
        const ordersQuery = `
            SELECT id, created_at as date, total_amount as total, status, shipping_address as "shippingAddress", customer_name as "customerName", customer_email as "customerEmail"
            FROM orders 
            WHERE user_id = $1 
            ORDER BY created_at DESC
        `;
        const ordersResult = await db.query(ordersQuery, [userId]);
        const orders = ordersResult.rows;

        if (orders.length === 0) {
            return res.json([]);
        }

        // 2. Get all order items for those orders in one query
        const orderIds = orders.map(o => o.id);
        const itemsQuery = `
            SELECT 
                oi.order_id, 
                oi.quantity, 
                oi.price_per_unit, 
                oi.selected_variant, 
                p.id as product_id, 
                p.name, 
                p.images 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ANY($1::int[])
        `;
        const itemsResult = await db.query(itemsQuery, [orderIds]);

        // 3. Map items to their respective orders
        const itemsByOrderId = itemsResult.rows.reduce((acc, item) => {
            if (!acc[item.order_id]) acc[item.order_id] = [];
            acc[item.order_id].push({
                id: item.product_id,
                name: item.name,
                price: parseFloat(item.price_per_unit),
                quantity: item.quantity,
                images: item.images,
                selectedVariant: item.selected_variant,
            });
            return acc;
        }, {});

        const ordersWithItems = orders.map(order => ({
            ...order,
            id: order.id.toString(),
            items: itemsByOrderId[order.id] || []
        }));

        res.json(ordersWithItems);
    } catch (error) {
        next(error);
    }
};
