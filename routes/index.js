const express = require('express');
const dayjs = require('dayjs');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

const router = express.Router();

// Home + búsqueda
router.get('/', async (req, res) => {
  try {
    const { city, guests, checkIn, checkOut } = req.query;
    const query = {};
    if (city) query.city = new RegExp(`^${city}$`, 'i');
    if (guests) query.maxGuests = { $gte: Number(guests) };

    let properties = await Property.find(query).sort({ createdAt: -1 }).lean();

    // Filtrar por disponibilidad si vienen fechas
    if (checkIn && checkOut) {
      const start = dayjs(checkIn, 'YYYY-MM-DD').toDate();
      const end = dayjs(checkOut, 'YYYY-MM-DD').toDate();

      const available = [];
      for (const p of properties) {
        const overlap = await Booking.exists({
          property: p._id,
          checkIn: { $lt: end },
          checkOut: { $gt: start }
        });
        if (!overlap) available.push(p);
      }
      properties = available;
    }

    res.render('home', { properties, query: req.query });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error cargando alojamientos');
  }
});

// Detalle de alojamiento
router.get('/property/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).lean();
    if (!property) return res.status(404).send('Alojamiento no encontrado');
    res.render('property', { property });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

module.exports = router;