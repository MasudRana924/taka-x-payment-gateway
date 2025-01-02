const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// MongoDB Connection
mongoose
    .connect('mongodb+srv://masud15924:mcash_924@cluster0.vrhnhtt.mongodb.net', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Routes
app.use('/checkout', paymentRoutes);
// Start the Server
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
