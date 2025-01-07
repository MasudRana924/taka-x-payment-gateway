const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/payment');

const validUsername = 'takatestUser';
const validAppKey = 'takamr924';
const secretKey = 'yourSecretKey';

// Create Token Controller
const createToken = (req, res) => {
    const { app_key, appsecret } = req.body;
    const { username, password } = req.headers;

    if (username !== validUsername || password !== 'test') {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (app_key !== validAppKey || appsecret !== 'takamr16115924') {
        return res.status(400).json({ message: 'Invalid app_key or appsecret' });
    }

    const token = jwt.sign({ username: validUsername }, secretKey, { expiresIn: '60m' });

    res.status(200).json({
        status: 'successful',
        token,
        expire: '60m',
    });
};

// Create Payment Controller
const createPayment = async (req, res) => {
    const { token, app_key } = req.headers;
    const { amount, intent, currency, callbackurl } = req.body;

    if (app_key !== validAppKey) {
        return res.status(400).json({ message: 'Invalid app_key' });
    }

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        if (decoded.username !== validUsername) {
            return res.status(401).json({ message: 'Token does not belong to the correct user' });
        }

        if (!amount || !intent || !currency || !callbackurl) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const paymentId = `TR${uuidv4()}`;
        // const paymentURL = `http://localhost:3001/api/version/1.00-beta/checkout/paymentID=${paymentId}`;
        // const paymentURL = `http://localhost:3001/payment/${paymentId}`;
        const paymentURL = `https://taka-pay-fintech-uat-ui.vercel.app/payment/${paymentId}`;
        // Save payment to database
        const payment = new Payment({
            paymentId,
            amount,
            currency,
            intent,
            paymentURL,
            callbackurl,
            state: 'initiate',
        });

        await payment.save();

        res.status(200).json({
            paymentId,
            amount,
            paymentURL,
            state: 'initiate',
            status: 'successful',
        });
    });
};

// Execute Payment Controller
const executePayment = async (req, res) => {
    const { token, app_key } = req.headers;
    const { paymentId } = req.body;

    if (!token || !app_key) {
        return res.status(400).json({ message: 'Missing token or app_key' });
    }
    if (app_key !== validAppKey) {
        return res.status(400).json({ message: 'Invalid app_key' });
    }
    if (!paymentId) {
        return res.status(400).json({ message: 'Missing paymentId' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        if (!decoded || decoded.username !== validUsername) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Check if payment exists
        const payment = await Payment.findOne({ paymentId });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Update payment state to "success"
        payment.state = 'success';
        await payment.save();

        res.status(200).json({
            message: 'Payment executed successfully',
            payment,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
const getPaymentDetails = async (req, res) => {
    const { paymentId } = req.params;

    if (!paymentId) {
        return res.status(400).json({ message: 'Missing paymentId' });
    }

    try {
        // Find the payment by paymentId
        const payment = await Payment.findOne({ paymentId });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({
            status: 'successful',
            payment,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { createToken, createPayment, executePayment,getPaymentDetails };
