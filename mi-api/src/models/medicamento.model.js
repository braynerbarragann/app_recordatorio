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

const create = async (nombre, presentacion, concentracion, descripcion) => {
  
    const [result] = await pool.query(
        'INSERT INTO medicamento (nombre, presentacion, concentracion, descripcion) VALUES (?, ?, ?, ?)',
        [nombre, presentacion, concentracion, descripcion]
    );
    return { id: result.insertId, nombre, presentacion, concentracion, descripcion};
};
const update = async (id, nombre, presentacion, concentracion, descripcion) => {

    const [result] = await pool.query('UPDATE medicamento SET nombre= ?, presentacion= ?, concentracion= ?, descripcion= ? WHERE id = ?',[nombre, presentacion, concentracion, descripcion, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id, nombre, presentacion, concentracion, descripcion};

}

const remove = async (id) => {

    const [result] = await pool.query('DELETE FROM medicamento WHERE id = ?',[id]);

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