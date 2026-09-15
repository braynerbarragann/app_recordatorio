const pool = require('../config/db');

const getAllByUsuarioId = async (usuarioId) => {
    const [rows] = await pool.query(
        'SELECT * FROM cita WHERE usuario_id = ? ORDER BY fecha_hora DESC',
        [usuarioId]
    );
    return rows;
};

const getById = async (citaId, usuarioId) => {
    const [rows] = await pool.query(
        'SELECT * FROM cita WHERE id = ? AND usuario_id = ?',
        [citaId, usuarioId]
    );
    return rows[0];
};


const create = async (usuarioId, descripcion, fecha_hora, estado) => {
    const [result] = await pool.query(
        'INSERT INTO cita (usuario_id, descripcion, fecha_hora, estado) VALUES (?, ?, ?, ?)',
        [usuarioId, descripcion, fecha_hora, estado]
    );
    return {id: result.insertId, usuarioId, descripcion, fecha_hora, estado}
} 

module.exports = {getAllByUsuarioId, getById, create};