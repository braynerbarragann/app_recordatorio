let UsuarioModel = require('../models/usuario.model')

const getAll = async (req, res) => {
  try {
    const data = await UsuarioModel.getAll();
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await UsuarioModel.getById(req.params.id);
    if (!data) return res.status(404)
      .json({ ok: false, msg: 'Usuario no encontrado' });
    
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, correo, telefono, contrasena_hash } = req.body;

    if (!nombre || !correo || !contrasena_hash)
      return res.status(400).json({ ok: false, msg: 'nombre, correo y contraseña requeridos' });

    const data = await UsuarioModel.create(nombre, correo, telefono, contrasena_hash);

    res.status(201).json({ ok: true, data });

  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const update = async (req, res) =>{
    try {
        const { id } = req.params;
        const { nombre, correo, telefono } = req.body

        if (!nombre || !correo) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre y correo es obligatorio'
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

module.exports = { getAll, getById, create, update, remove};