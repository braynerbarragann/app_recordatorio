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
    const presentacionMedicamento = presentacion ?? null;
    const concentracionValor = concentracion_valor ?? null;
    const concentracionUnidad = concentracion_unidad ?? null;
    const descripcionMedicamento = descripcion ?? null;

    const [result] = await pool.query(
        'INSERT INTO medicamento (nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion) VALUES (?, ?, ?, ?, ?)',
        [nombre, presentacionMedicamento, concentracionValor, concentracionUnidad, descripcionMedicamento]
    );
    return {
        id: result.insertId,
        nombre,
        presentacion: presentacionMedicamento,
        concentracion_valor: concentracionValor,
        concentracion_unidad: concentracionUnidad,
        descripcion: descripcionMedicamento
    };
};
const update = async (id, nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion) => {
    const presentacionMedicamento = presentacion ?? null;
    const concentracionValor = concentracion_valor ?? null;
    const concentracionUnidad = concentracion_unidad ?? null;
    const descripcionMedicamento = descripcion ?? null;

    const [result] = await pool.query('UPDATE medicamento SET nombre= ?, presentacion= ?, concentracion_valor= ?, concentracion_unidad= ?, descripcion= ? WHERE id = ?',[nombre, presentacionMedicamento, concentracionValor, concentracionUnidad, descripcionMedicamento, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return {
        id,
        nombre,
        presentacion: presentacionMedicamento,
        concentracion_valor: concentracionValor,
        concentracion_unidad: concentracionUnidad,
        descripcion: descripcionMedicamento
    };

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
