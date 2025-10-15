
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user payload to the request object
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (ex) {
        // This will catch expired tokens, invalid signatures, etc.
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = { authenticate };
