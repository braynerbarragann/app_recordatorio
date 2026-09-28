const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM dia_semana'
    );

    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM dia_semana WHERE id = ?',
        [id]
    );

    return rows[0];
};

const create = async (id, nombre) => {
  
    const [result] = await pool.query(
        'INSERT INTO dia_semana (id, nombre) VALUES (?, ?)',
        [id, nombre]
    );
    return { id, nombre};
};

const update = async (id, nombre) => {

    const [result] = await pool.query('UPDATE dia_semana SET nombre= ? WHERE id = ?',[nombre, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id, nombre};

}

const remove = async (id) => {

    const [result] = await pool.query('DELETE FROM dia_semana WHERE id = ?',[id]);

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
