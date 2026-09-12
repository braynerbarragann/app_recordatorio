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

const getByUsuarioId = async (usuarioId) => {
    const [rows] = await pool.query(
        'SELECT * FROM medicamento WHERE usuario_id = ? ORDER BY id DESC',
        [usuarioId]
    );

    return rows;
};

const create = async (data) => {
    const {
        usuario_id,
        nombre,
        presentacion,
        concentracion,
        descripcion
    } = data;

    const [result] = await pool.query(
        `INSERT INTO medicamento
        (usuario_id, nombre, presentacion, concentracion, descripcion)
        VALUES (?, ?, ?, ?, ?)`,
        [
            usuario_id,
            nombre,
            presentacion,
            concentracion,
            descripcion
        ]
    );

    return {
        id: result.insertId,
        usuario_id,
        nombre,
        presentacion,
        concentracion,
        descripcion
    };
};

module.exports = {
    getAll,
    getById,
    getByUsuarioId,
    create
};