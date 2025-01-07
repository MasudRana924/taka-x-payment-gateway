// const express = require('express');
// const jwt = require('jsonwebtoken');
// const { executePayment } = require('../controllers/paymentController');
// const { v4: uuidv4 } = require('uuid');
// const router = express.Router();
// // Example credentials
// const validUsername = 'takatestUser';
// const validAppKey = 'takamr924';
// const secretKey = 'yourSecretKey'; // Same secret used for signing JWTs

// // Create Token API
// router.post('/create/token', (req, res) => {
//     const { app_key, appsecret } = req.body;
//     const { username, password } = req.headers;

//     if (username !== validUsername || password !== 'test') {
//         return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     if (app_key !== validAppKey || appsecret !== 'takamr16115924') {
//         return res.status(400).json({ message: 'Invalid app_key or appsecret' });
//     }

//     const token = jwt.sign({ username: validUsername }, secretKey, { expiresIn: '60m' });

//     res.status(200).json({
//         status: 'successful',
//         token, expire: '60m'
//     });
// });

// router.post('/create/payment', (req, res) => {
//     const { token, app_key } = req.headers;
//     const { amount, intent, currency, callbackurl } = req.body;

//     if (app_key !== validAppKey) {
//         return res.status(400).json({ message: 'Invalid app_key' });
//     }

//     if (!token) {
//         return res.status(400).json({ message: 'Token is required' });
//     }

//     jwt.verify(token, secretKey, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'Invalid or expired token' });
//         }

//         if (decoded.username !== 'takatestUser') {
//             return res.status(401).json({ message: 'Token does not belong to the correct user' });
//         }

//         if (!amount || !intent || !currency || !callbackurl) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }

//         const paymentId = `TR${uuidv4()}`;
//         const paymentURL = `http://localhost:3000/api/version/1.00-beta/checkout/paymentID=${paymentId}`;
//         // const paymentURL = `https://taka-x-payment-gateway.onrender.com/api/version/1.00-beta/checkout/paymentID=${paymentId}`;


//         res.status(200).json({
//             paymentId,
//             amount,
//             paymentURL,
//             state: 'initiate',
//             status: 'successful',
//         });
//     });
// });

// // Payment Page Route
// router.get('/paymentID=:paymentId', (req, res) => {
//     const { paymentId } = req.params;
//     res.render('payment', { paymentId });
// });


// router.post('/execute', executePayment);

// module.exports = router;
const express = require('express');
const { createToken, createPayment, executePayment, getPaymentDetails } = require('../controllers/paymentController');
const router = express.Router();
const Payment = require('../models/payment');
router.post('/create/token', createToken);
router.post('/create/payment', createPayment);
router.post('/execute', executePayment);
router.get('/paymentID=:paymentId', (req, res) => {
    const { paymentId } = req.params;
    res.render('payment', { paymentId });
});
// router.get('/payment/:paymentId', getPaymentDetails);

router.get('/payment/:paymentId', async (req, res) => {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({ paymentId });
    
    if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
});

module.exports = router;
