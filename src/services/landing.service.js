const { sql, getPool } = require('../config/db');

async function guardarMensaje(payload) {
  const pool = await getPool();
  const request = pool.request();

  request.input('Nombre', sql.NVarChar(150), payload.nombre);
  request.input('Empresa', sql.NVarChar(150), payload.empresa || null);
  request.input('Correo', sql.NVarChar(150), payload.correo);
  request.input('Telefono', sql.NVarChar(50), payload.telefono || null);
  request.input('Asunto', sql.NVarChar(200), payload.asunto);
  request.input('Mensaje', sql.NVarChar(sql.MAX), payload.mensaje);

  const result = await request.execute('dbo.lan_sp_guardar_mensaje');
  const inserted = result.recordset && result.recordset[0] ? result.recordset[0] : null;

  return inserted || { mensaje: 'Registro creado.' };
}

module.exports = {
  guardarMensaje,
};
