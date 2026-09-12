const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM via_administracion ORDER BY id DESC'
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

module.exports = {
    getAll,
    getById,
};