const express = require('express');
const Property = require('../models/Property');

const router = express.Router();

// Formulario de alta
router.get('/new', (req, res) => {
  res.render('admin_new');
});

// Crear alojamiento
router.post('/', async (req, res) => {
  try {
    const { name, city, address, description, pricePerNight, maxGuests, images } = req.body;
    const imgs = (images || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    await Property.create({
      name,
      city,
      address,
      description,
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests),
      images: imgs
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(400).send('No se pudo crear el alojamiento');
  }
});

module.exports = router;