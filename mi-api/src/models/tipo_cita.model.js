const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM tipo_cita'
    );

    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM tipo_cita WHERE id = ?',
        [id]
    );

    return rows[0];
};

const create = async (nombre, descripcion) => {
    const descripcionTipoCita = descripcion ?? null;
  
    const [result] = await pool.query(
        'INSERT INTO tipo_cita (nombre, descripcion) VALUES (?, ?)',
        [nombre, descripcionTipoCita]
    );
    return { id: result.insertId, nombre, descripcion: descripcionTipoCita};
};

const update = async (id, nombre, descripcion) => {
    const descripcionTipoCita = descripcion ?? null;

    const [result] = await pool.query('UPDATE tipo_cita SET nombre= ?, descripcion= ? WHERE id = ?',[nombre, descripcionTipoCita, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id, nombre, descripcion: descripcionTipoCita};

}

const remove = async (id) => {

    const [result] = await pool.query('DELETE FROM tipo_cita WHERE id = ?',[id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id };
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
