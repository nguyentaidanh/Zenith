
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../../middlewares/validation.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('password').notEmpty().withMessage('Password is required.'),
    validate
], authController.login);

router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('phone').trim().notEmpty().withMessage('Phone number is required.'),
    validate
], authController.register);

router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
