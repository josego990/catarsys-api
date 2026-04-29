const landingService = require('../services/landing.service');
const turnstileService = require('../services/turnstile.service');

const TURNSTILE_RESPONSE_MAX_LENGTH = 2048;

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

function normalizeValue(value) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
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
    const turnstileToken = normalizeValue(req.body['cf-turnstile-response']);
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

    if (!turnstileToken) {
      return res.status(400).json({
        ok: false,
        message: 'El campo cf-turnstile-response es obligatorio.',
        captcha: {
          provider: 'turnstile',
          validated: false,
        },
      });
    }

    if (turnstileToken.length > TURNSTILE_RESPONSE_MAX_LENGTH) {
      return res.status(400).json({
        ok: false,
        message: 'El token de captcha no tiene un formato válido.',
        captcha: {
          provider: 'turnstile',
          validated: false,
        },
      });
    }

    const captchaValidation = await turnstileService.validarToken(
      turnstileToken,
      turnstileService.getRemoteIp(req)
    );

    if (!captchaValidation.success) {
      return res.status(400).json({
        ok: false,
        message: 'No se pudo validar el captcha.',
        captcha: {
          provider: 'turnstile',
          validated: false,
        },
      });
    }

    const result = await landingService.guardarMensaje(payload);

    return res.status(201).json({
      ok: true,
      message: 'Mensaje guardado correctamente. Captcha validado.',
      captcha: {
        provider: 'turnstile',
        validated: true,
      },
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
