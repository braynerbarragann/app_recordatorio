const TratamientoModel = require('../models/tratamiento.model');

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const formatTratamiento = (t) => ({
    id: t.id,
    diagnostico: t.diagnostico_relacionado_id == null ? null : {
        id: t.diagnostico_relacionado_id,
        enfermedad: {
            id: t.enfermedad_id,
            tipo_enfermedad: {
                id: t.tipo_enfermedad_id,
                nombre: t.tipo_enfermedad_nombre,
                descripcion: t.tipo_enfermedad_descripcion
            },
            nombre: t.enfermedad_nombre,
            descripcion: t.enfermedad_descripcion,
            codigo_cie10: t.enfermedad_codigo_cie10
        },
        cita: t.cita_relacionada_id == null ? null : {
            id: t.cita_relacionada_id,
            fecha_hora: t.cita_fecha_hora,
            descripcion: t.cita_descripcion,
            estado: t.cita_estado
        },
        fecha_diagnostico: t.fecha_diagnostico,
        observaciones: t.diagnostico_observaciones,
        estado: t.diagnostico_estado
    },
    nombre: t.nombre,
    descripcion: t.descripcion
});

const getAllByPacienteId = async (req, res) => {
    try {
        const dataModel = await TratamientoModel.getAllByPacienteId(req.params.pacienteId);
        const data = dataModel.map(formatTratamiento);

        return res.json({ ok: true, data });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const dataModel = await TratamientoModel.getById(req.params.id, req.params.pacienteId);
        if (!dataModel) {
            return res.status(404).json({ ok: false, msg: 'Tratamiento no encontrado' });
        }

        return res.json({ ok: true, data: formatTratamiento(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { diagnostico_id, nombre, descripcion } = req.body;
        const pacienteId = req.params.pacienteId;
        const camposRequeridos = ['nombre'];

        if (faltanCampos(req.body, camposRequeridos) || !pacienteId || !nombre) {
            return res.status(400).json({
                ok: false,
                msg: 'nombre y pacienteId son requeridos'
            });
        }

        if (diagnostico_id != null
            && !await TratamientoModel.diagnosticoPerteneceAlPaciente(diagnostico_id, pacienteId)) {
            return res.status(400).json({
                ok: false,
                msg: 'El diagnóstico indicado no pertenece a este paciente'
            });
        }

        const dataModel = await TratamientoModel.create(
            pacienteId,
            diagnostico_id,
            nombre,
            descripcion
        );

        return res.status(201).json({ ok: true, data: formatTratamiento(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { pacienteId, id } = req.params;
        const { diagnostico_id, nombre, descripcion } = req.body;
        const camposRequeridos = ['diagnostico_id', 'nombre', 'descripcion'];

        if (faltanCampos(req.body, camposRequeridos) || !pacienteId || !id || !nombre) {
            return res.status(400).json({
                ok: false,
                msg: 'Envíe todos los campos; diagnostico_id y descripcion pueden ser null'
            });
        }

        if (diagnostico_id != null
            && !await TratamientoModel.diagnosticoPerteneceAlPaciente(diagnostico_id, pacienteId)) {
            return res.status(400).json({
                ok: false,
                msg: 'El diagnóstico indicado no pertenece a este paciente'
            });
        }

        const dataModel = await TratamientoModel.update(
            id,
            pacienteId,
            diagnostico_id,
            nombre,
            descripcion
        );

        if (!dataModel) {
            return res.status(404).json({ ok: false, msg: 'Tratamiento no encontrado' });
        }

        return res.json({ ok: true, data: formatTratamiento(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const resultado = await TratamientoModel.remove(req.params.id, req.params.pacienteId);
        if (!resultado) {
            return res.status(404).json({ ok: false, msg: 'Tratamiento no encontrado' });
        }

        return res.json({ ok: true, msg: 'Tratamiento eliminado correctamente' });
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
