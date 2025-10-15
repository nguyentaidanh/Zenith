
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

// All routes in this file are protected
router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);

module.exports = router;
