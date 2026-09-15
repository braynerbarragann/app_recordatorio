const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM via_administracion'
    );

    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM via_administracion WHERE id = ?',
        [id]
    );

    return rows[0];
};

const create = async (nombre, descripcion) => {
  
    const [result] = await pool.query(
        'INSERT INTO via_administracion (nombre, descripcion) VALUES (?, ?)',
        [nombre, descripcion]
    );
    return { id: result.insertId, nombre, descripcion};
};

module.exports = {
    getAll,
    getById,
    create
};