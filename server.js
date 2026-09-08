const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Reservation = require('./models/Reservation');
const Subscriber = require('./models/Subscriber');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:5500', 
    'https://soho-skybar-restaurant.netlify.app'
  ],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.post('/api/reservations', async (req, res) => {
  try {
    const { fullName, phone, date, timeSlot, guests, seatingZone, notes } = req.body;
    const newReservation = new Reservation({ fullName, phone, date, timeSlot, guests, seatingZone, notes });
    await newReservation.save();
    res.status(201).json({ success: true, message: 'Reservation saved successfully!' });
  } catch (error) {
    console.error('Detailed reservation error:', error.message);
    res.status(500).json({ success: false, message: error.message }); // Sends exact error to frontend
  }
});

app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reservations });
  } catch (error) {
    console.error('Detailed reservations error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(200).json({ success: true, message: 'Already subscribed!' });

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(201).json({ success: true, message: 'Successfully joined!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});