const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const landingRoutes = require('./routes/landing.routes');

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origen no permitido por CORS'));
    },
  })
);
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.json({
    ok: true,
    app: 'CatarSys API',
    version: '1.0.0',
    message: 'Servicio activo.',
  });
});

app.use('/', landingRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada.',
  });
});

app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    ok: false,
    message: err.message || 'Error interno del servidor.',
  });
});

module.exports = app;
