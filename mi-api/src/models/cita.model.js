const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM cita ORDER BY id DESC'
    );
    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM cita WHERE id = ?',
        [id]
    );
    return rows[0];
};

const getByUsuarioId = async (usuarioId) => {
    const [rows] = await pool.query(
        'SELECT * FROM cita WHERE usuario_id = ? ORDER BY id DESC',
        [usuarioId]
    );
    return rows;
};

module.exports = { getAll, getById, getByUsuarioId };