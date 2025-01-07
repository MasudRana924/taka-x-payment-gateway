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
       
    },
    currency: {
        type: String,
        default: 'BDT',
    },
    intent: {
        type: String,
        default: 'sale',
    },
    paymentURL: {
        type: String,
    },
    callbackurl: {
        type: String,
    },
    state: {
        type: String,
        default: 'initiate',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Payment Model
const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
