const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM tipo_relacion'
    );

    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM tipo_relacion WHERE id = ?',
        [id]
    );

    return rows[0];
};

const create = async (nombre) => {
  
    const [result] = await pool.query(
        'INSERT INTO tipo_relacion (nombre) VALUES (?)',
        [nombre]
    );
    return { id: result.insertId, nombre};
};

const update = async (id, nombre) => {

    const [result] = await pool.query('UPDATE tipo_relacion SET nombre= ? WHERE id = ?',[nombre, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id, nombre};

}

const remove = async (id) => {

    const [result] = await pool.query('DELETE FROM tipo_relacion WHERE id = ?',[id]);

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