const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM paciente ORDER BY id'
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM paciente WHERE id = ?', [id]
  );
  return rows[0]; // undefined si no existe
};

const create = async (tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion) => {
  const [result] = await pool.query(
    'INSERT INTO paciente (tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion) VALUES (?, ?, ?, ?, ?, ?)',
    [tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion]
  );
  return { id: result.insertId, nombre, numero_documento, fecha_nacimiento, direccion};
};


module.exports = {getAll, getById, create};