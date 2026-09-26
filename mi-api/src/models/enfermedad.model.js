const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT 
	    e.id, e.nombre, e.descripcion, e.codigo_cie10, 
        te.id as tipo_enfermedad_id, te.nombre as tipo_enfermedad, te.descripcion as te_descripcion
    FROM enfermedad e 
	INNER JOIN tipo_enfermedad te ON e.tipo_enfermedad_id = te.id;`
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT 
	    e.id, e.nombre, e.descripcion, e.codigo_cie10, 
        te.id as tipo_enfermedad_id, te.nombre as tipo_enfermedad, te.descripcion as te_descripcion
    FROM enfermedad e 
	INNER JOIN tipo_enfermedad te ON e.tipo_enfermedad_id = te.id
    where e.id= ?`, [id]
  );
  return rows[0]; // undefined si no existe
};

const create = async (tipo_enfermedad_id, nombre, descripcion, codigo_cie10) => {
  const [result] = await pool.query(
    'INSERT INTO enfermedad (tipo_enfermedad_id, nombre, descripcion, codigo_cie10) VALUES (?, ?, ?, ?)',
    [tipo_enfermedad_id, nombre, descripcion, codigo_cie10]
  );
  return { id: result.insertId, tipo_enfermedad_id, nombre, descripcion, codigo_cie10};
};

const update = async (id, tipo_enfermedad_id, nombre, descripcion, codigo_cie10) => {

    const [result] = await pool.query('UPDATE enfermedad SET tipo_enfermedad_id= ?, nombre= ?, descripcion= ?, codigo_cie10= ? WHERE id = ?',[tipo_enfermedad_id, nombre, descripcion, codigo_cie10, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return {id, tipo_enfermedad_id, nombre, descripcion, codigo_cie10};

}

const remove = async (id) => {

    const [result] = await pool.query('DELETE FROM enfermedad WHERE id = ?',[id]);

    if (result.affectedRows === 0) {
      return null;
    }

    return { id };
}


module.exports = {getAll, getById, create, update, remove};