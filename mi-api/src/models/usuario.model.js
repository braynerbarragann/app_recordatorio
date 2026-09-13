const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM usuario ORDER BY id DESC'
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuario WHERE id = ?', [id]
  );
  return rows[0]; // undefined si no existe
};

const create = async ({ nombre, genero, correo, telefono, fecha_nacimiento, contraseña_hash }) => {
  const [result] = await pool.query(
    'INSERT INTO usuario (nombre, genero, correo, telefono, fecha_nacimiento, contraseña_hash) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, genero, correo, telefono, fecha_nacimiento, contraseña_hash]
  );
  return { id: result.insertId, nombre, genero, correo, telefono, fecha_nacimiento};
};


module.exports = {getAll, getById, create};