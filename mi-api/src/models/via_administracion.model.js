const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM via_administracion'
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

const create = async (nombre, descripcion) => {
    const descripcionVia = descripcion ?? null;

    const [result] = await pool.query(
        'INSERT INTO via_administracion (nombre, descripcion) VALUES (?, ?)',
        [nombre, descripcionVia]
    );
    return { id: result.insertId, nombre, descripcion: descripcionVia};
};

const update = async (id, nombre, descripcion) => {
    const descripcionVia = descripcion ?? null;

    const [result] = await pool.query('UPDATE via_administracion SET nombre= ?, descripcion= ? WHERE id = ?',[nombre, descripcionVia, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id, nombre, descripcion: descripcionVia};

}

const remove = async (id) => {

    const [result] = await pool.query('DELETE FROM via_administracion WHERE id = ?',[id]);

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
