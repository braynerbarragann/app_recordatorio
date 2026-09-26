const PacienteModel = require('../models/paciente.model')

const formatPaciente = (p) => ({
    id: p.id,
    tipo_documento: {
    id: p.tipo_documento_id,
      nombre: p.tipo_documento,
      abreviatura: p.tipo_documento_abreviatura
    },
    genero: {
      id: p.genero_id,
      nombre: p.genero,
      abreviatura: p.genero_abreviatura
    },
    nombre: p.nombre,
    numero_documento: p.numero_documento,
    fecha_nacimiento: p.fecha_nacimiento,
    direccion: p.direccion,
    estado: p.estado
});

const getAll = async (req, res) => {
  try {
    const dataModel = await PacienteModel.getAll();
    const data = dataModel.map(formatPaciente);
    
    return res.json({ ok: true, data });

  } catch (err) {

    return res.status(500).json({ ok: false, msg: err.message });

  }
};

const getById = async (req, res) => {
  try {
    const pacienteModel = await PacienteModel.getById(req.params.id);
    if (!pacienteModel) return res.status(404)
      .json({ ok: false, msg: 'Paciente no encontrado' });
    
    const data = formatPaciente(pacienteModel)

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

const update = async (req, res) =>{
    try {
        const { id } = req.params;
        const { tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion } = req.body

        if (!tipo_documento_id || !nombre || !numero_documento)
        return res.status(400).json({ ok: false, msg: 'tipo documento, nombre y numero documento son  requeridos' });

        const updatePaciente = await PacienteModel.update(id, tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion);

        if (!updatePaciente) {
            return res.status(404).json({
                ok: false,
                msg: 'Paciente no encontrado'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updatePaciente
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al editar paciente'
        });
    }
};

const remove = async (req, res) => {
    try {
        const resultado =
            await PacienteModel.remove(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: 'Paciente no encontrado'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Paciente eliminado correctamente'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar paciente'
        });
    }
};


module.exports = { getAll, getById, create, update, remove};