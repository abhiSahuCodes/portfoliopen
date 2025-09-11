const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth');

// Desc     -   Create payment order for subscription upgrade
// Route    -   POST /api/payment/create-order
// Access   -   Private
router.post('/create-order', protect, paymentController.createOrder);

// Desc     -   Verify payment completion and update user subscription
// Route    -   POST /api/payment/verify
// Access   -   Private
router.post('/verify', protect, paymentController.verifyPayment);

// Desc     -   Handle payment gateway webhook notifications
// Route    -   POST /api/payment/webhook
// Access   -   Public
router.post('/webhook', paymentController.webhook);

// Desc     -   Get payment status by payment ID
// Route    -   GET /api/payment/status/:paymentId
// Access   -   Private
router.get('/status/:paymentId', protect, paymentController.getPaymentStatus);

module.exports = router;