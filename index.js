require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./utils/db');

const app = express();

// Conexión a MongoDB
connectDB();
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true })); // Formularios
app.use(express.static(path.join(__dirname, 'public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/bookings'));

// 404 simple
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bravabook Lite en http://localhost:${PORT}`));