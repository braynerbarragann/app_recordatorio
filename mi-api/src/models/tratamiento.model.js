const pool = require('../config/db');

const getAllByUsuarioId = async (usuarioId) => {
    const [rows] = await pool.query(
        'SELECT * FROM tratamiento WHERE usuario_id = ?',
        [usuarioId]
    );
    return rows;
};

const getById = async (tratamientoId, usuarioId) => {
    const [rows] = await pool.query(
        'SELECT * FROM tratamiento WHERE id = ? AND usuario_id = ?',
        [tratamientoId, usuarioId]
    );
    return rows[0];
};


const create = async (usuarioId, nombre, descripcion) => {
    const [result] = await pool.query(
        'INSERT INTO tratamiento (usuario_id, nombre, descripcion) VALUES (?, ?, ?)',
        [usuarioId, nombre, descripcion]
    );
    return {id: result.insertId, usuarioId, nombre, descripcion}
} 

module.exports = {getAllByUsuarioId, getById, create};