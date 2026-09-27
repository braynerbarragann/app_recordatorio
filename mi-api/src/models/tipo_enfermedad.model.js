const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM tipo_enfermedad'
    );

    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM tipo_enfermedad WHERE id = ?',
        [id]
    );

    return rows[0];
};

const create = async (nombre, descripcion) => {
  
    const [result] = await pool.query(
        'INSERT INTO tipo_enfermedad (nombre, descripcion) VALUES (?, ?)',
        [nombre, descripcion]
    );
    return { id: result.insertId, nombre, descripcion};
};

const update = async (id, nombre, descripcion) => {

    const [result] = await pool.query('UPDATE tipo_enfermedad SET nombre= ?, descripcion= ? WHERE id = ?',[nombre, descripcion, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id, nombre, descripcion};

}

const remove = async (id) => {

    const [result] = await pool.query('DELETE FROM tipo_enfermedad WHERE id = ?',[id]);

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