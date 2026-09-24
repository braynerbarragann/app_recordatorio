const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM usuario ORDER BY id'
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuario WHERE id = ?', [id]
  );
  return rows[0]; // undefined si no existe
};

const create = async (nombre, correo, telefono, contrasena_hash) => {
  const [result] = await pool.query(
    'INSERT INTO usuario (nombre, correo, telefono, contrasena_hash) VALUES (?, ?, ?, ?)',
    [nombre, correo, telefono, contrasena_hash]
  );
  return { id: result.insertId, nombre, correo, telefono};
};


module.exports = {getAll, getById, create};