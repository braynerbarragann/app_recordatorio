const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM genero'
    );

    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM genero WHERE id = ?',
        [id]
    );

    return rows[0];
};

const create = async (nombre, abreviatura) => {
  
    const [result] = await pool.query(
        'INSERT INTO genero (nombre, abreviatura) VALUES (?, ?)',
        [nombre, abreviatura]
    );
    return { id: result.insertId, nombre, abreviatura};
};

const update = async (id, nombre, abreviatura) => {

    const [result] = await pool.query('UPDATE genero SET nombre= ?, abreviatura= ? WHERE id = ?',[nombre, abreviatura, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id, nombre, abreviatura};

}

const remove = async (id) => {

    const [result] = await pool.query('DELETE FROM genero WHERE id = ?',[id]);

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