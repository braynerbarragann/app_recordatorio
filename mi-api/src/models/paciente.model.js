const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT 
      p.id, p.nombre, p.numero_documento, p.fecha_nacimiento, p.direccion, p.estado, 
      td.id AS tipo_documento_id, td.nombre AS tipo_documento, td.abreviatura AS tipo_documento_abreviatura, 
      g.id AS genero_id, g.nombre AS genero, g.abreviatura AS genero_abreviatura 
      FROM paciente p 
      INNER JOIN tipo_documento td ON p.tipo_documento_id = td.id 
      LEFT JOIN genero g ON p.genero_id = g.id;`
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT 
      p.id, p.nombre, p.numero_documento, p.fecha_nacimiento, p.direccion, p.estado, 
      td.id AS tipo_documento_id, td.nombre AS tipo_documento, td.abreviatura AS tipo_documento_abreviatura, 
      g.id AS genero_id, g.nombre AS genero, g.abreviatura AS genero_abreviatura 
      FROM paciente p 
      INNER JOIN tipo_documento td ON p.tipo_documento_id = td.id 
      LEFT JOIN genero g ON p.genero_id = g.id
      where p.id= ?`, [id]
  );
  return rows[0]; // undefined si no existe
};

const create = async (tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion) => {
  const fechaNacimiento = fecha_nacimiento ?? null;
  const direccionPaciente = direccion ?? null;

  const [result] = await pool.query(
    'INSERT INTO paciente (tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion) VALUES (?, ?, ?, ?, ?, ?)',
    [tipo_documento_id, genero_id, nombre, numero_documento, fechaNacimiento, direccionPaciente]
  );
  return { id: result.insertId, tipo_documento_id, genero_id, nombre, numero_documento, fechaNacimiento, direccionPaciente};
};

const update = async (id, tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion) => {
    const fechaNacimiento = fecha_nacimiento ?? null;
    const direccionPaciente = direccion ?? null;

    const [result] = await pool.query('UPDATE paciente SET tipo_documento_id= ?, genero_id= ?, nombre= ?, numero_documento= ?, fecha_nacimiento= ?, direccion= ? WHERE id = ?',[tipo_documento_id, genero_id, nombre, numero_documento, fechaNacimiento, direccionPaciente, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return {id, tipo_documento_id, genero_id, nombre, numero_documento, fechaNacimiento, direccionPaciente};

}

const remove = async (id) => {

    const [result] = await pool.query('DELETE FROM paciente WHERE id = ?',[id]);

    if (result.affectedRows === 0) {
      return null;
    }

    return { id };
}


module.exports = {getAll, getById, create, update, remove};
