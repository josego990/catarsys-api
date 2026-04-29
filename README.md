# CatarSys API

API base con Express + SQL Server para la landing de CatarSys.

## Endpoints

- `GET /prueba-servicio`
- `POST /landing_msg`

## Variables de entorno

1. Copia `.env.example` como `.env`
2. Llena los datos reales de SQL Server
3. Agrega `TURNSTILE_SECRET_KEY` con la llave secreta de Cloudflare Turnstile

## Ejecución local

```bash
npm install
npm start
```

## Body esperado para POST /landing_msg

```json
{
  "nombre": "Juan Pérez",
  "empresa": "CatarSys",
  "correo": "juan@catarsysdev.com",
  "telefono": "502 00000000",
  "asunto": "Consulta comercial",
  "mensaje": "Quisiera más información sobre sus servicios.",
  "cf-turnstile-response": "TOKEN_GENERADO_POR_TURNSTILE"
}
```
