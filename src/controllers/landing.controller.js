const landingService = require('../services/landing.service');

function sanitizeText(value, maxLength) {
  if (value === undefined || value === null) {
    return '';
  }

  const normalized = String(value).trim();
  return normalized.substring(0, maxLength);
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function pruebaServicio(req, res, next) {
  try {
    return res.status(200).json({
      ok: true,
      message: 'El servicio responde correctamente.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
}

async function guardarMensaje(req, res, next) {
  try {
    const payload = {
      nombre: sanitizeText(req.body.nombre, 150),
      empresa: sanitizeText(req.body.empresa, 150),
      correo: sanitizeText(req.body.correo, 150),
      telefono: sanitizeText(req.body.telefono, 50),
      asunto: sanitizeText(req.body.asunto, 200),
      mensaje: sanitizeText(req.body.mensaje, 4000),
    };

    if (!payload.nombre) {
      return res.status(400).json({ ok: false, message: 'El campo nombre es obligatorio.' });
    }

    if (!payload.correo) {
      return res.status(400).json({ ok: false, message: 'El campo correo es obligatorio.' });
    }

    if (!validateEmail(payload.correo)) {
      return res.status(400).json({ ok: false, message: 'El correo no tiene un formato válido.' });
    }

    if (!payload.asunto) {
      return res.status(400).json({ ok: false, message: 'El campo asunto es obligatorio.' });
    }

    if (!payload.mensaje) {
      return res.status(400).json({ ok: false, message: 'El campo mensaje es obligatorio.' });
    }

    const result = await landingService.guardarMensaje(payload);

    return res.status(201).json({
      ok: true,
      message: 'Mensaje guardado correctamente.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  pruebaServicio,
  guardarMensaje,
};
