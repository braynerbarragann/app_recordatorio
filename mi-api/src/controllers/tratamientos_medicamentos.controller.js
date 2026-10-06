const tratamientoMedicamentoModel = require('../models/tratamiento_medicamento.model');

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const esIdValido = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

const esFechaValida = (fecha) => {
    if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;

    const fechaParseada = new Date(`${fecha}T00:00:00.000Z`);
    return !Number.isNaN(fechaParseada.getTime())
        && fechaParseada.toISOString().slice(0, 10) === fecha;
};

const formatTratamientoMedicamento = (tm) => ({
    id: tm.id,
    tratamiento_id: tm.tratamiento_id,
    medicamento: {
        id: tm.medicamento_id,
        nombre: tm.medicamento_nombre,
        presentacion: tm.medicamento_presentacion,
        concentracion_valor: tm.medicamento_concentracion_valor,
        concentracion_unidad: tm.medicamento_concentracion_unidad,
        descripcion: tm.medicamento_descripcion
    },
    via_administracion: {
        id: tm.via_administracion_id,
        nombre: tm.via_administracion_nombre,
        descripcion: tm.via_administracion_descripcion
    },
    tipo_frecuencia: {
        id: tm.tipo_frecuencia_id,
        nombre: tm.tipo_frecuencia_nombre,
        descripcion: tm.tipo_frecuencia_descripcion
    },
    instruccion: tm.instruccion,
    dosis: tm.dosis,
    unidad_dosis: tm.unidad_dosis,
    intervalo_horas: tm.intervalo_horas,
    fecha_inicio: tm.fecha_inicio,
    fecha_fin: tm.fecha_fin
});

const validarTratamientoPadre = async (pacienteId, tratamientoId, res) => {
    if (!await tratamientoMedicamentoModel.tratamientoPerteneceAlPaciente(tratamientoId, pacienteId)) {
        res.status(404).json({ ok: false, msg: 'Tratamiento no encontrado para este paciente' });
        return false;
    }

    return true;
};

const getAll = async (req, res) => {
    try {
        const { pacienteId, tratamientoId } = req.params;
        if (!pacienteId || !tratamientoId) {
            return res.status(400).json({ ok: false, msg: 'pacienteId y tratamientoId son requeridos' });
        }
        if (!await validarTratamientoPadre(pacienteId, tratamientoId, res)) return;

        const dataModel = await tratamientoMedicamentoModel.getAllByTratamientoId(tratamientoId, pacienteId);
        const data = dataModel.map(formatTratamientoMedicamento);

        return res.json({ ok: true, data });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const { pacienteId, tratamientoId, tratamientoMedicamentoId } = req.params;
        if (!pacienteId || !tratamientoId || !tratamientoMedicamentoId) {
            return res.status(400).json({ ok: false, msg: 'Los identificadores de la ruta son requeridos' });
        }
        if (!await validarTratamientoPadre(pacienteId, tratamientoId, res)) return;

        const dataModel = await tratamientoMedicamentoModel.getById(
            tratamientoMedicamentoId,
            tratamientoId,
            pacienteId
        );
        if (!dataModel) {
            return res.status(404).json({ ok: false, msg: 'Medicamento del tratamiento no encontrado' });
        }

        return res.json({ ok: true, data: formatTratamientoMedicamento(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const create = async (req, res) => {
    try {
        const {
            medicamento_id,
            via_administracion_id,
            tipo_frecuencia_id,
            instruccion,
            dosis,
            unidad_dosis,
            intervalo_horas,
            fecha_inicio,
            fecha_fin
        } = req.body;
        const { pacienteId, tratamientoId } = req.params;
        const camposRequeridos = [
            'medicamento_id',
            'via_administracion_id',
            'tipo_frecuencia_id',
            'dosis',
            'unidad_dosis',
            'fecha_inicio'
        ];

        if (faltanCampos(req.body, camposRequeridos)
            || !esIdValido(pacienteId)
            || !esIdValido(tratamientoId)
            || !esIdValido(medicamento_id)
            || !esIdValido(via_administracion_id)
            || !esIdValido(tipo_frecuencia_id)
            || !Number.isFinite(Number(dosis))
            || Number(dosis) <= 0
            || typeof unidad_dosis !== 'string'
            || !unidad_dosis.trim()
            || !esFechaValida(fecha_inicio)
            || (intervalo_horas != null
                && (!Number.isInteger(Number(intervalo_horas)) || Number(intervalo_horas) <= 0))
            || (fecha_fin != null
                && (!esFechaValida(fecha_fin) || fecha_fin < fecha_inicio))) {
            return res.status(400).json({
                ok: false,
                msg: 'Envíe los campos requeridos con valores válidos; instruccion, intervalo_horas y fecha_fin pueden ser null'
            });
        }
        if (!await validarTratamientoPadre(pacienteId, tratamientoId, res)) return;

        const dataModel = await tratamientoMedicamentoModel.create(
            tratamientoId,
            pacienteId,
            medicamento_id,
            via_administracion_id,
            tipo_frecuencia_id,
            instruccion,
            dosis,
            unidad_dosis.trim(),
            intervalo_horas,
            fecha_inicio,
            fecha_fin
        );

        return res.status(201).json({ ok: true, data: formatTratamientoMedicamento(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const update = async (req, res) => {
    try {
        const {
            medicamento_id,
            via_administracion_id,
            tipo_frecuencia_id,
            instruccion,
            dosis,
            unidad_dosis,
            intervalo_horas,
            fecha_inicio,
            fecha_fin
        } = req.body;
        const { pacienteId, tratamientoId, tratamientoMedicamentoId } = req.params;
        const camposRequeridos = [
            'medicamento_id',
            'via_administracion_id',
            'tipo_frecuencia_id',
            'instruccion',
            'dosis',
            'unidad_dosis',
            'intervalo_horas',
            'fecha_inicio',
            'fecha_fin'
        ];

        if (faltanCampos(req.body, camposRequeridos)
            || !esIdValido(pacienteId)
            || !esIdValido(tratamientoId)
            || !esIdValido(tratamientoMedicamentoId)
            || !esIdValido(medicamento_id)
            || !esIdValido(via_administracion_id)
            || !esIdValido(tipo_frecuencia_id)
            || !Number.isFinite(Number(dosis))
            || Number(dosis) <= 0
            || typeof unidad_dosis !== 'string'
            || !unidad_dosis.trim()
            || !esFechaValida(fecha_inicio)
            || (intervalo_horas != null
                && (!Number.isInteger(Number(intervalo_horas)) || Number(intervalo_horas) <= 0))
            || (fecha_fin != null
                && (!esFechaValida(fecha_fin) || fecha_fin < fecha_inicio))) {
            return res.status(400).json({
                ok: false,
                msg: 'Envíe todos los campos con valores válidos; instruccion, intervalo_horas y fecha_fin pueden ser null'
            });
        }
        if (!await validarTratamientoPadre(pacienteId, tratamientoId, res)) return;

        const dataModel = await tratamientoMedicamentoModel.update(
            tratamientoMedicamentoId,
            tratamientoId,
            pacienteId,
            medicamento_id,
            via_administracion_id,
            tipo_frecuencia_id,
            instruccion,
            dosis,
            unidad_dosis.trim(),
            intervalo_horas,
            fecha_inicio,
            fecha_fin
        );
        if (!dataModel) {
            return res.status(404).json({ ok: false, msg: 'Medicamento del tratamiento no encontrado' });
        }

        return res.json({ ok: true, data: formatTratamientoMedicamento(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const { pacienteId, tratamientoId, tratamientoMedicamentoId } = req.params;
        if (!esIdValido(pacienteId) || !esIdValido(tratamientoId) || !esIdValido(tratamientoMedicamentoId)) {
            return res.status(400).json({ ok: false, msg: 'Los identificadores de la ruta deben ser válidos' });
        }
        if (!await validarTratamientoPadre(pacienteId, tratamientoId, res)) return;

        const resultado = await tratamientoMedicamentoModel.remove(
            tratamientoMedicamentoId,
            tratamientoId,
            pacienteId
        );
        if (!resultado) {
            return res.status(404).json({ ok: false, msg: 'Medicamento del tratamiento no encontrado' });
        }

        return res.json({ ok: true, msg: 'Medicamento del tratamiento eliminado correctamente' });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
