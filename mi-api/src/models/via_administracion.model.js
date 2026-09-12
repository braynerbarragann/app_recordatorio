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

const getByUsuarioId = async (usuarioId) => {
    const [rows] = await pool.query(
        'SELECT * FROM via_administracion WHERE usuario_id = ? ORDER BY id DESC',
        [usuarioId]
    );

    return rows;
};

const create = async (data) => {
    const {
        usuario_id,
        nombre,
        descripcion
    } = data;

    const [result] = await pool.query(
        `INSERT INTO via_administracion
        (usuario_id, nombre, descripcion)
        VALUES (?, ?)`,
        [
            usuario_id,
            nombre,
            descripcion
        ]
    );

    return {
        id: result.insertId,
        usuario_id,
        nombre,
        descripcion
    };
};

module.exports = {
    getAll,
    getById,
    getByUsuarioId,
    create
};