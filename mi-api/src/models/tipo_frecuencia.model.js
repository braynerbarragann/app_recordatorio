const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM tipo_frecuencia'
    );

    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM tipo_frecuencia WHERE id = ?',
        [id]
    );

    return rows[0];
};

const create = async (nombre, descripcion) => {
    const descripcionTipoFrecuencia = descripcion ?? null;
  
    const [result] = await pool.query(
        'INSERT INTO tipo_frecuencia (nombre, descripcion) VALUES (?, ?)',
        [nombre, descripcionTipoFrecuencia]
    );
    return { id: result.insertId, nombre, descripcion: descripcionTipoFrecuencia};
};

const update = async (id, nombre, descripcion) => {
    const descripcionTipoFrecuencia = descripcion ?? null;

    const [result] = await pool.query('UPDATE tipo_frecuencia SET nombre= ?, descripcion= ? WHERE id = ?',[nombre, descripcionTipoFrecuencia, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id, nombre, descripcion: descripcionTipoFrecuencia};

}

const remove = async (id) => {

    const [result] = await pool.query('DELETE FROM tipo_frecuencia WHERE id = ?',[id]);

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
