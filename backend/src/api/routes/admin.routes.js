
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorizeAdmin } = require('../../middlewares/admin.middleware');
const productController = require('../controllers/product.controller'); // For product actions

// Protect all admin routes
router.use(authenticate, authorizeAdmin);

// Dashboard
router.get('/stats', adminController.getAdminStats);

// Product Management (from admin context)
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Order Management
router.get('/orders', adminController.getAdminOrders);
router.put('/orders/:id', adminController.updateOrderStatus);

// User Management
router.get('/users', adminController.getAdminUsers);
router.post('/users/:id/reset-password', adminController.resetUserPassword);

// Review Management
router.get('/reviews', adminController.getAdminReviews);
router.post('/reviews/toggle', adminController.toggleReviewVisibility);


module.exports = router;
