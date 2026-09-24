const PacienteModel = require('../models/paciente.model')

const getAll = async (req, res) => {
  try {
    const data = await PacienteModel.getAll();
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await PacienteModel.getById(req.params.id);
    if (!data) return res.status(404)
      .json({ ok: false, msg: 'Paciente no encontrado' });
    
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion } = req.body;

    if (!tipo_documento_id || !nombre || !numero_documento)
        return res.status(400).json({ ok: false, msg: 'tipo documento, nombre y numero documento son  requeridos' });

    const data = await PacienteModel.create(tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion);

    res.status(201).json({ ok: true, data });

  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { getAll, getById, create};