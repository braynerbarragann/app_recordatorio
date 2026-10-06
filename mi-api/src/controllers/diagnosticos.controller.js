const DiagnosticoModel = require('../models/diagnostico.model');

const estadosValidos = ['ACTIVO', 'RESUELTO', 'INACTIVO'];

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const formatDiagnostico = (d) => ({
    id: d.id,
    enfermedad: {
        id: d.enfermedad_id,
        tipo_enfermedad: {
            id: d.tipo_enfermedad_id,
            nombre: d.tipo_enfermedad_nombre,
            descripcion: d.tipo_enfermedad_descripcion
        },
        nombre: d.enfermedad_nombre,
        descripcion: d.enfermedad_descripcion,
        codigo_cie10: d.enfermedad_codigo_cie10
    },
    cita: d.cita_relacionada_id == null ? null : {
        id: d.cita_relacionada_id,
        fecha_hora: d.cita_fecha_hora,
        descripcion: d.cita_descripcion,
        estado: d.cita_estado
    },
    fecha_diagnostico: d.fecha_diagnostico,
    observaciones: d.observaciones,
    estado: d.estado
});

const getAllByPacienteId = async (req, res) => {
    try {
        const dataModel = await DiagnosticoModel.getAllByPacienteId(req.params.pacienteId);
        const data = dataModel.map(formatDiagnostico);

        return res.json({ ok: true, data });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const dataModel = await DiagnosticoModel.getById(req.params.id, req.params.pacienteId);
        if (!dataModel) {
            return res.status(404).json({ ok: false, msg: 'Diagnóstico no encontrado' });
        }

        return res.json({ ok: true, data: formatDiagnostico(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { enfermedad_id, cita_id, fecha_diagnostico, observaciones } = req.body;
        const pacienteId = req.params.pacienteId;
        const camposRequeridos = ['enfermedad_id'];

        if (faltanCampos(req.body, camposRequeridos) || !pacienteId || !enfermedad_id) {
            return res.status(400).json({
                ok: false,
                msg: 'enfermedad_id y pacienteId son requeridos'
            });
        }

        if (cita_id != null && !await DiagnosticoModel.citaPerteneceAlPaciente(cita_id, pacienteId)) {
            return res.status(400).json({
                ok: false,
                msg: 'La cita indicada no pertenece a este paciente'
            });
        }

        const dataModel = await DiagnosticoModel.create(
            pacienteId,
            enfermedad_id,
            cita_id,
            fecha_diagnostico,
            observaciones
        );

        return res.status(201).json({ ok: true, data: formatDiagnostico(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { pacienteId, id } = req.params;
        const { enfermedad_id, cita_id, fecha_diagnostico, observaciones, estado } = req.body;
        const camposRequeridos = [
            'enfermedad_id',
            'cita_id',
            'fecha_diagnostico',
            'observaciones',
            'estado'
        ];

        if (faltanCampos(req.body, camposRequeridos)
            || !pacienteId
            || !id
            || !enfermedad_id
            || !estadosValidos.includes(estado)) {
            return res.status(400).json({
                ok: false,
                msg: 'Envíe todos los campos; cita_id, fecha_diagnostico y observaciones pueden ser null, y estado debe ser válido'
            });
        }

        if (cita_id != null && !await DiagnosticoModel.citaPerteneceAlPaciente(cita_id, pacienteId)) {
            return res.status(400).json({
                ok: false,
                msg: 'La cita indicada no pertenece a este paciente'
            });
        }

        const dataModel = await DiagnosticoModel.update(
            id,
            pacienteId,
            enfermedad_id,
            cita_id,
            fecha_diagnostico,
            observaciones,
            estado
        );

        if (!dataModel) {
            return res.status(404).json({ ok: false, msg: 'Diagnóstico no encontrado' });
        }

        return res.json({ ok: true, data: formatDiagnostico(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const resultado = await DiagnosticoModel.remove(req.params.id, req.params.pacienteId);
        if (!resultado) {
            return res.status(404).json({ ok: false, msg: 'Diagnóstico no encontrado' });
        }

        return res.json({ ok: true, msg: 'Diagnóstico eliminado correctamente' });
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
