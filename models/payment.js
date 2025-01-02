const mongoose = require('mongoose');

// Define the Payment Schema
const PaymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Payment Model
const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
