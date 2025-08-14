const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String },
    description: { type: String },
    pricePerNight: { type: Number, required: true, min: 0 },
    maxGuests: { type: Number, required: true, min: 1 },
    images: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', PropertySchema);