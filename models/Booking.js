const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    guestName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    guests: { type: Number, required: true, min: 1 },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);