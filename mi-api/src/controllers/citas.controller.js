const CitaModel = require('../models/cita.model');

const formatCita = (c) => ({
    "id": c.id,
    "tipo_cita": {
      "id": c.tipo_cita_id,
      "nombre": c.tipo_cita_nombre,
      "descripcion": c.tipo_cita_descripcion
    },
    "descripcion": c.descripcion,
    "fecha_hora": c.fecha_hora,
    "estado": c.estado
});

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const getAllByPacienteId = async (req, res) => {
    try {
        const dataModel = await CitaModel.getAllByPacienteId(req.params.pacienteId);
        const data = dataModel.map(formatCita);

        return res.json({ ok: true, data });
    } catch (err) {

        return res.status(500).json({ ok: false, msg: err.message });

    }
};

const getById = async (req, res) => {
    try {
        const dataModel = await CitaModel.getById(req.params.id, req.params.pacienteId);
        if (!dataModel) {
            return res.status(404).json({ ok: false, msg: 'Cita no encontrada' });
        }

        const data = formatCita(dataModel)

        return res.json({ ok: true, data });
    } catch (err) {

        return res.status(500).json({ ok: false, msg: err.message });

    }
};

const create = async (req, res) => {
    try {
        const { tipo_cita_id, descripcion, fecha_hora } = req.body;
        const pacienteId = req.params.pacienteId;
        const camposRequeridos = ['tipo_cita_id', 'fecha_hora'];

        if (faltanCampos(req.body, camposRequeridos) || !pacienteId || !tipo_cita_id || !fecha_hora) {
            return res.status(400).json({
                ok: false,
                msg: 'tipo_cita_id y fecha_hora son requeridos'
            });
        }

        const data = await CitaModel.create(pacienteId, tipo_cita_id, descripcion, fecha_hora);
        return res.status(201).json({ ok: true, data });
    } catch (err) {

        return res.status(500).json({ ok: false, msg: err.message });

    }
};

const update = async (req, res) => {
    try {
        const { pacienteId, id } = req.params;
        const { tipo_cita_id, descripcion, fecha_hora } = req.body;
        const camposRequeridos = ['tipo_cita_id', 'descripcion', 'fecha_hora'];

        if (faltanCampos(req.body, camposRequeridos)
            || !pacienteId
            || !id
            || !tipo_cita_id
            || !fecha_hora) {
            return res.status(400).json({
                ok: false,
                msg: 'Todos los campos de la cita son requeridos; descripcion puede ser null'
            });
        }

        const data = await CitaModel.update(id, pacienteId, tipo_cita_id, descripcion, fecha_hora);
        if (!data) {
            return res.status(404).json({ ok: false, msg: 'Cita no encontrada' });
        }

        return res.json({ ok: true, data });
    } catch (err) {

        return res.status(500).json({ ok: false, msg: err.message });

    }
};

const remove = async (req, res) => {
    try {
        const resultado = await CitaModel.remove(req.params.id, req.params.pacienteId);
        if (!resultado) {
            return res.status(404).json({ ok: false, msg: 'Cita no encontrada' });
        }

        return res.json({ ok: true, msg: 'Cita eliminada correctamente' });
    } catch (err) {

        return res.status(500).json({ ok: false, msg: err.message });

    }
};

module.exports = {
    getAllByPacienteId,
    getById,
    create,
    update,
    remove
};
