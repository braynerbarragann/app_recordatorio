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

module.exports = { getAll, getById, create};