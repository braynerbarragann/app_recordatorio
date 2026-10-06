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
    const { id } = req.params;
    const { nombre, correo, telefono } = req.body

    const camposRequeridos = ['nombre', 'correo', 'telefono'];
    const faltaCampo = faltanCampos(req.body, camposRequeridos);

    if (faltaCampo || !nombre || !correo) {
      return res.status(400).json({
        ok: false,
        msg: 'nombre y correo son requeridos; telefono puede ser null'
      });
    };

    const updateUsuario = await UsuarioModel.update(id, nombre, correo, telefono);

    if (!updateUsuario) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no encontrado'
      });
    };

    return res.status(200).json({
      ok: true,
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
    const resultado =
      await UsuarioModel.remove(req.params.id);

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
      msg: 'Error al eliminar la usuario'
    });
  }
};

module.exports = { getAll, getById, update, remove };
