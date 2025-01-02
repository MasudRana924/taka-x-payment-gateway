const Payment = require('../models/payment');
const jwt = require('jsonwebtoken');
// Execute Payment Controller
const executePayment = async (req, res) => {
    const { token, app_key } = req.headers;
    const { paymentId } = req.body;

    // Validate headers and body
    if (!token || !app_key) {
        return res.status(400).json({ message: 'Missing token or app_key' });
    }
    if (app_key !== 'takamr924') {
        return res.status(400).json({ message: 'Invalid app_key' });
    }
    if (!paymentId ) {
        return res.status(400).json({ message: 'Missing paymentId' });
    }

    try {
        // Verify token (example validation using jwt.verify)
        const decoded = jwt.verify(token, 'yourSecretKey');
        if (!decoded || decoded.username !== 'takatestUser') {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Check if payment already exists
        const existingPayment = await Payment.findOne({ paymentId });
        if (existingPayment) {
            return res.status(400).json({ message: 'Payment already executed' });
        }

        // Save payment to database
        const payment = new Payment({ paymentId});
        await payment.save();

        res.status(200).json({ message: 'Payment executed successfully', payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { executePayment };
