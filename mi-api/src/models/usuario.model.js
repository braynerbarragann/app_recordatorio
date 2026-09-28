const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT id, nombre, correo, telefono, fecha_registro, estado, ultimo_acceso FROM usuario ORDER BY id'
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, nombre, correo, telefono, fecha_registro, estado, ultimo_acceso FROM usuario WHERE id = ?', [id]
  );
  return rows[0]; // undefined si no existe
};

const create = async (nombre, correo, telefono, contrasena_hash) => {
  const telefonoUsuario = telefono ?? null;

  const [result] = await pool.query(
    'INSERT INTO usuario (nombre, correo, telefono, contrasena_hash) VALUES (?, ?, ?, ?)',
    [nombre, correo, telefonoUsuario, contrasena_hash]
  );
  return { id: result.insertId, nombre, correo, telefono: telefonoUsuario};
};

const update = async (id, nombre, correo, telefono) => {
    const telefonoUsuario = telefono ?? null;

    const [result] = await pool.query('UPDATE usuario SET nombre= ?, correo= ?, telefono= ? WHERE id = ?',[nombre, correo, telefonoUsuario, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id, nombre, correo, telefono: telefonoUsuario};

}

const remove = async (id) => {

    const [result] = await pool.query('DELETE FROM usuario WHERE id = ?',[id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { id };
}


module.exports = {getAll, getById, create, update, remove};
