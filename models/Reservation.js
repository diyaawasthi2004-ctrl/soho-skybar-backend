const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  guests: { type: Number, required: true }, // Changed from String to Number
  seatingZone: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);