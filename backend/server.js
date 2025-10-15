
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./src/api/routes/auth.routes');
const productRoutes = require('./src/api/routes/products.routes');
const orderRoutes = require('./src/api/routes/orders.routes');
const adminRoutes = require('./src/api/routes/admin.routes');
const errorHandler = require('./src/middlewares/errorHandler.middleware');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate Limiter to prevent spam and brute-force attacks
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler - must be the last middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Zenith backend server is running on http://localhost:${PORT}`);
});
