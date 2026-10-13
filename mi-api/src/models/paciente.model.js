const pool = require('../config/db');

const getById = async (usuarioId, pacienteId, conexion = pool) => {
  const [rows] = await conexion.query(
    `SELECT 
    p.id,
    p.nombre,
    p.numero_documento,
    p.fecha_nacimiento,
    p.direccion,
    p.estado,

    td.id AS tipo_documento_id,
    td.nombre AS tipo_documento,
    td.abreviatura AS tipo_documento_abreviatura,

    g.id AS genero_id,
    g.nombre AS genero,
    g.abreviatura AS genero_abreviatura

    FROM paciente p

    INNER JOIN tipo_documento td 
    ON p.tipo_documento_id = td.id

    LEFT JOIN genero g 
    ON p.genero_id = g.id

    INNER JOIN usuario_paciente up
    ON p.id = up.paciente_id

    WHERE p.id = ?
    AND up.usuario_id = ?;`, [pacienteId, usuarioId]
  );
  return rows[0]; // undefined si no existe
};

const create = async (tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion, usuario_id, tipo_relacion_id) => {

  const fechaNacimiento = fecha_nacimiento ?? null;
  const direccionPaciente = direccion ?? null;

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    const [paciente] = await conexion.query(
      'INSERT INTO paciente (tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion) VALUES (?, ?, ?, ?, ?, ?)',
      [tipo_documento_id, genero_id, nombre, numero_documento, fechaNacimiento, direccionPaciente]
    );

    await conexion.query(
      'INSERT INTO usuario_paciente (usuario_id, paciente_id, tipo_relacion_id) VALUES (?, ?, ?)',
      [usuario_id, paciente.insertId, tipo_relacion_id]
    );
    const pacienteExistente = await getById(usuario_id, paciente.insertId, conexion);
    await conexion.commit();

    

    return pacienteExistente;
  } catch (err) {
    await conexion.rollback();
    throw err;
  } finally {
    conexion.release();
  }

};

const update = async (tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion, usuarioId, pacienteId) => {
  const fechaNacimiento = fecha_nacimiento ?? null;
  const direccionPaciente = direccion ?? null;

  const [result] = await pool.query(`
    UPDATE paciente AS p
    SET
    tipo_documento_id = ?,
    genero_id = ?,
    nombre = ?,
    numero_documento = ?,
    fecha_nacimiento = ?,
    direccion = ?
    WHERE p.id = ?
      AND EXISTS (
      SELECT 1
      FROM usuario_paciente AS up
      WHERE up.paciente_id = p.id
        AND up.usuario_id = ?
      );
    `, [tipo_documento_id, genero_id, nombre, numero_documento, fechaNacimiento, direccionPaciente, pacienteId, usuarioId]);

  const pacienteExistente = await getById(usuarioId, pacienteId);
  if (result.affectedRows === 0) {
    if (!pacienteExistente) {
      return null;
    }
  }

  return pacienteExistente;

}




module.exports = { getById, create, update };
