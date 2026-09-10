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

module.exports = {getAll, getById};