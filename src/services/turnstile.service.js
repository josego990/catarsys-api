const TURNSTILE_SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_TIMEOUT_MS = 5000;

function getRemoteIp(req) {
  const cloudflareIp = req.get('cf-connecting-ip');
  if (cloudflareIp) {
    return cloudflareIp.trim();
  }

  const forwardedFor = req.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return req.ip || null;
}

function normalizeTurnstileResult(result) {
  return {
    success: Boolean(result.success),
    challengeTs: result.challenge_ts || null,
    hostname: result.hostname || null,
    action: result.action || null,
    cdata: result.cdata || null,
    errorCodes: Array.isArray(result['error-codes']) ? result['error-codes'] : [],
  };
}

async function validarToken(token, remoteip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    const error = new Error('La validación de captcha no está configurada.');
    error.statusCode = 500;
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS);
  const body = {
    secret,
    response: token,
  };

  if (remoteip) {
    body.remoteip = remoteip;
  }

  try {
    const response = await fetch(TURNSTILE_SITEVERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = new Error('No fue posible validar el captcha.');
      error.statusCode = 502;
      throw error;
    }

    const result = await response.json();
    return normalizeTurnstileResult(result);
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('La validación de captcha agotó el tiempo de espera.');
      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    if (error.statusCode) {
      throw error;
    }

    const validationError = new Error('No fue posible validar el captcha.');
    validationError.statusCode = 502;
    throw validationError;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  getRemoteIp,
  validarToken,
};
