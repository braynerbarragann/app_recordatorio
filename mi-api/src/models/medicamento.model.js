const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM medicamento ORDER BY id DESC'
    );

    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM medicamento WHERE id = ?',
        [id]
    );

    return rows[0];
};

const create = async (nombre, presentacion, concentracion, descripcion) => {
  
    const [result] = await pool.query(
        'INSERT INTO medicamento (nombre, presentacion, concentracion, descripcion) VALUES (?, ?, ?, ?)',
        [nombre, presentacion, concentracion, descripcion]
    );
    return { id: result.insertId, nombre, presentacion, concentracion, descripcion};
};


module.exports = {
    getAll,
    getById,
    create
};