const express = require('express');
const jwt = require('jsonwebtoken');
const { executePayment } = require('../controllers/paymentController');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Example credentials
const validUsername = 'takatestUser';
const validAppKey = 'takamr924';
const secretKey = 'yourSecretKey'; // Same secret used for signing JWTs

// Create Token API
router.post('/create/token', (req, res) => {
    const { app_key, appsecret } = req.body;
    const { username, password } = req.headers;

    // Validate username and password in header
    if (username !== validUsername || password !== 'test') {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Validate app_key and appsecret
    if (app_key !== validAppKey || appsecret !== 'takamr16115924') {
        return res.status(400).json({ message: 'Invalid app_key or appsecret' });
    }

    // Generate token
    const token = jwt.sign({ username: validUsername }, secretKey, { expiresIn: '60m' });

    // Return token and expiration time
    res.status(200).json({ token, expire: '60m' });
});
router.post('/create/payment', (req, res) => {
    const { token, app_key } = req.headers;
    const { amount, intent, currency, callbackurl } = req.body;

    // Verify app_key
    if (app_key !== validAppKey) {
        return res.status(400).json({ message: 'Invalid app_key' });
    }

    // Validate token
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Ensure the token is for the correct user
        if (decoded.username !== 'takatestUser') {
            return res.status(401).json({ message: 'Token does not belong to the correct user' });
        }

        // Validate request body
        if (!amount || !intent || !currency || !callbackurl) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Generate a unique payment ID
        const paymentId = uuidv4();

        // Create payment URL
        // const paymentURL = `http://localhost:3000/checkout/${paymentId}`;
        const paymentURL = `https://taka-x-payment-gateway.onrender.com/checkout/${paymentId}`;
        const callbackURL = `http://localhost:3000/checkout/${callbackurl}`;
        
        // Respond with payment details
        res.status(200).json({
            paymentId,
            amount,
            paymentURL,
            callbackurl
        });
    });
});

// Payment Page Route
router.get('/:paymentId', (req, res) => {
    const { paymentId } = req.params;
    // Render the payment input page
    res.render('payment', { paymentId });
});

router.post('/execute', executePayment);
module.exports = router;
