const express = require('express');
const landingController = require('../controllers/landing.controller');

const router = express.Router();

router.get('/prueba-servicio', landingController.pruebaServicio);
router.post('/landing_msg', landingController.guardarMensaje);

module.exports = router;
