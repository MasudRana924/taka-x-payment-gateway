const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/paymentRoutes');
const path = require('path'); // Added to set the views path
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the correct path to views

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
