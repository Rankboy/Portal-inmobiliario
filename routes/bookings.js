const express = require('express');
const dayjs = require('dayjs');
const Booking = require('../models/Booking');
const Property = require('../models/Property');

const router = express.Router();

router.post('/book/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { guestName, email, phone, guests, checkIn, checkOut } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).render('booking_error', { message: 'Alojamiento no encontrado' });

    const start = dayjs(checkIn, 'YYYY-MM-DD');
    const end = dayjs(checkOut, 'YYYY-MM-DD');

    if (!start.isValid() || !end.isValid() || !end.isAfter(start)) {
      return res.status(400).render('booking_error', { message: 'Fechas inválidas' });
    }

    if (Number(guests) > property.maxGuests) {
      return res.status(400).render('booking_error', { message: 'Número de huéspedes supera el máximo del alojamiento' });
    }

    // Comprobar solape: existe alguna reserva cuyo rango [checkIn, checkOut) se solape
    const overlap = await Booking.exists({
      property: propertyId,
      checkIn: { $lt: end.toDate() },
      checkOut: { $gt: start.toDate() }
    });

    if (overlap) {
      return res.status(409).render('booking_error', { message: 'Las fechas elegidas no están disponibles' });
    }

    await Booking.create({
      property: propertyId,
      guestName,
      email,
      phone,
      guests: Number(guests),
      checkIn: start.toDate(),
      checkOut: end.toDate()
    });

    res.render('booking_success');
  } catch (err) {
    console.error(err);
    res.status(500).render('booking_error', { message: 'No se pudo completar la reserva' });
  }
});

module.exports = router;