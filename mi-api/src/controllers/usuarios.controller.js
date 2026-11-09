let UsuarioModel = require('../models/usuario.model')

const faltanCampos = (body, camposRequeridos) => {
  return camposRequeridos.some(campo =>
    !Object.prototype.hasOwnProperty.call(body, campo)
  );
};

const getAll = async (req, res) => {
  try {
    const data = await UsuarioModel.getAll();
    return res.json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const usuarioId = req.usuario.usuario_id;
    const data = await UsuarioModel.getById(usuarioId);

    if (!data) return res.status(404)
      .json({ ok: false, msg: 'Usuario no encontrado' });

    return res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const update = async (req, res) => {
  try {
<<<<<<< HEAD
<<<<<<< HEAD
    // Obtener el ID desde el token JWT
    const id = req.usuario.usuario_id;
    const { nombre, correo, telefono } = req.body;
=======
    const usuarioId = req.usuario.usuario_id;
    const { nombre, correo, telefono } = req.body
>>>>>>> 75887e0edb04c799ec909fb69d2d1b65726d5e31
=======
    // Obtener el ID desde el token JWT
    const id = req.usuario.usuario_id;
    const { nombre, correo, telefono } = req.body;
>>>>>>> 303ea9b3c54bc90ddd77809cd98dd81b5c1eb00d

    if (
      !nombre ||
      !correo ||
      !Object.prototype.hasOwnProperty.call(req.body, 'telefono')
    ) {
      return res.status(400).json({
        ok: false,
        msg: 'nombre, correo y telefono son requeridos; telefono puede ser null'
      });
    }

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 303ea9b3c54bc90ddd77809cd98dd81b5c1eb00d
    const updateUsuario = await UsuarioModel.update(
      id,
      nombre,
      correo,
      telefono
    );
<<<<<<< HEAD
=======
    const updateUsuario = await UsuarioModel.update(usuarioId, nombre, correo, telefono);
>>>>>>> 75887e0edb04c799ec909fb69d2d1b65726d5e31
=======
>>>>>>> 303ea9b3c54bc90ddd77809cd98dd81b5c1eb00d

    if (!updateUsuario) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      ok: true,
      msg: 'Usuario actualizado correctamente',
      data: updateUsuario
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      msg: 'Error al editar usuario'
    });
  }
};

const remove = async (req, res) => {
  try {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 303ea9b3c54bc90ddd77809cd98dd81b5c1eb00d
    // Obtener el ID desde el token JWT
    const id = req.usuario.usuario_id;

    const resultado = await UsuarioModel.remove(id);
<<<<<<< HEAD
=======
    const usuarioId = req.usuario.usuario_id;
    const resultado = await UsuarioModel.remove(usuarioId);
>>>>>>> 75887e0edb04c799ec909fb69d2d1b65726d5e31
=======
>>>>>>> 303ea9b3c54bc90ddd77809cd98dd81b5c1eb00d

    if (!resultado) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      ok: true,
      msg: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      msg: 'Error al eliminar el usuario'
    });
  }
};

module.exports = { getAll, getById, update, remove };

