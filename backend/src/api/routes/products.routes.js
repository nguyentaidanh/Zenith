
const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { body } = require('express-validator');
const validate = require('../../middlewares/validation.middleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected route for adding a review
router.post('/:id/reviews', [
    authenticate,
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('comment').trim().notEmpty().withMessage('Comment cannot be empty.'),
    validate,
], productController.addProductReview);

module.exports = router;
