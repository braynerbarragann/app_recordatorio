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

const create = async (nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion) => {
  
    const [result] = await pool.query(
        'INSERT INTO medicamento (nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion) VALUES (?, ?, ?, ?, ?)',
        [nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion]
    );
    return { id: result.insertId, nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion};
};
const update = async (id, nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion) => {

    const [result] = await pool.query('UPDATE medicamento SET nombre= ?, presentacion= ?, concentracion_valor= ?, concentracion_unidad= ?, descripcion= ? WHERE id = ?',[nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id, nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion};

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