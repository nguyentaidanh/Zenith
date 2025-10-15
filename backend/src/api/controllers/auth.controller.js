
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    const { name, email, phone, password } = req.body;
    try {
        const userExists = await db.query('SELECT 1 FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUserQuery = `
            INSERT INTO users (name, email, phone, password_hash, role) 
            VALUES ($1, $2, $3, $4, 'customer') 
            RETURNING id, name, email, phone, role;
        `;
        const { rows } = await db.query(newUserQuery, [name, email, phone, password_hash]);
        const user = rows[0];

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token, user: { ...user, orders: [] } });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT id, name, email, phone, role, password_hash FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Remove password hash from the response object
        const { password_hash, ...userResponse } = user;
        res.json({ token, user: { ...userResponse, orders: [] } });
    } catch (error) {
        next(error);
    }
};

exports.getCurrentUser = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const result = await db.query('SELECT id, name, email, phone, role FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ user: { ...result.rows[0], orders: [] } });
    } catch (error) {
        next(error);
    }
};
