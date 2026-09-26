const EnfermedadModel = require('../models/enfermedad.model')

const formatEnfermedad= (e) => ({
    id: e.id,
    tipo_enfermedad: {
        id: e.tipo_enfermedad_id,
        nombre: e.tipo_enfermedad,
        descripcion: e.te_descripcion
    },
    nombre: e.nombre,
    descripcion: e.descripcion,
    codigo_cie10: e.codigo_cie10
});

const getAll = async (req, res) => {
  try {
    const dataModel = await EnfermedadModel.getAll();
    const data = dataModel.map(formatEnfermedad);
    
    return res.json({ ok: true, data});

  } catch (err) {

    return res.status(500).json({ ok: false, msg: err.message });

  }
};

const getById = async (req, res) => {
  try {
    const enfermedadModel = await EnfermedadModel.getById(req.params.id);
    if (!enfermedadModel) return res.status(404)
        .json({ ok: false, msg: 'Enfermedad no encontrada' });
    
    const data = formatEnfermedad(enfermedadModel)

    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const create = async (req, res) => {
  try {
    const {tipo_enfermedad_id, nombre, descripcion, codigo_cie10 } = req.body;

    if (!tipo_enfermedad_id || !nombre)
        return res.status(400).json({ ok: false, msg: 'tipo enfermedad y nombre son  requeridos' });

    const data = await EnfermedadModel.create(tipo_enfermedad_id, nombre, descripcion, codigo_cie10);

    res.status(201).json({ ok: true, data });

  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const update = async (req, res) =>{
    try {
        const { id } = req.params;
        const { tipo_enfermedad_id, nombre, descripcion, codigo_cie10 } = req.body

        if (!tipo_enfermedad_id || !nombre)
        return res.status(400).json({ ok: false, msg: 'tipo enfermedad y nombre son  requeridos' });

        const updateEnfermedad = await EnfermedadModel.update(id, tipo_enfermedad_id, nombre, descripcion, codigo_cie10);

        if (!updateEnfermedad) {
            return res.status(404).json({
                ok: false,
                msg: 'Paciente no encontrado'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updateEnfermedad
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al editar enfermedad'
        });
    }
};

const remove = async (req, res) => {
    try {
        const resultado =
            await EnfermedadModel.remove(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: 'Enfermedad no encontrado'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Enfermedad eliminado correctamente'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar enfermedad'
        });
    }
};


module.exports = { getAll, getById, create, update, remove};