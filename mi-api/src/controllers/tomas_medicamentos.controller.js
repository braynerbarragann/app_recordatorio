const TomaMedicamentoModel = require('../models/toma_medicamento.model');

const estadosValidos = ['PENDIENTE', 'TOMADA', 'OMITIDA', 'VENCIDA'];

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const esIdValido = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

const esFechaHoraValida = (fechaHora) => {
    if (typeof fechaHora !== 'string') return false;

    const fechaNormalizada = fechaHora.replace('T', ' ').replace(/\.\d{1,6}(Z)?$/, '$1');
    const partes = fechaNormalizada.match(
        /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(Z)?$/
    );
    if (!partes) return false;

    const [, anio, mes, dia, hora, minuto, segundo] = partes;
    const fecha = new Date(`${anio}-${mes}-${dia}T00:00:00.000Z`);

    return !Number.isNaN(fecha.getTime())
        && fecha.toISOString().slice(0, 10) === `${anio}-${mes}-${dia}`
        && Number(hora) <= 23
        && Number(minuto) <= 59
        && Number(segundo) <= 59;
};

const normalizarFechaHora = (fechaHora) => fechaHora
    .replace('T', ' ')
    .replace(/\.\d{1,6}Z?$/, '')
    .replace(/Z$/, '');

const formatToma = (toma) => ({
    id: toma.id,
    tratamiento_medicamento_id: toma.tratamiento_medicamento_id,
    estado: toma.estado,
    fecha_hora_programada: toma.fecha_hora_programada,
    fecha_hora_registro: toma.fecha_hora_registro
});

const validarTratamientoMedicamento = async (req, res) => {
    const { pacienteId, tratamientoId, tratamientoMedicamentoId } = req.params;

    if (!esIdValido(pacienteId)
        || !esIdValido(tratamientoId)
        || !esIdValido(tratamientoMedicamentoId)) {
        res.status(400).json({ ok: false, msg: 'Los identificadores de la ruta deben ser válidos' });
        return false;
    }

    const pertenece = await TomaMedicamentoModel.tratamientoMedicamentoPerteneceAlPaciente(
        tratamientoMedicamentoId,
        tratamientoId,
        pacienteId
    );
    if (!pertenece) {
        res.status(404).json({ ok: false, msg: 'Medicamento del tratamiento no encontrado para este paciente' });
        return false;
    }

    return true;
};

const getAll = async (req, res) => {
    try {
        if (!await validarTratamientoMedicamento(req, res)) return;

        const { pacienteId, tratamientoId, tratamientoMedicamentoId } = req.params;
        const dataModel = await TomaMedicamentoModel.getAll(
            tratamientoMedicamentoId,
            tratamientoId,
            pacienteId
        );
        const data = dataModel.map(formatToma);

        return res.json({ ok: true, data });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const getById = async (req, res) => {
    try {
        if (!await validarTratamientoMedicamento(req, res)) return;

        const { pacienteId, tratamientoId, tratamientoMedicamentoId, tomaId } = req.params;
        if (!esIdValido(tomaId)) {
            return res.status(400).json({ ok: false, msg: 'tomaId debe ser un identificador válido' });
        }

        const dataModel = await TomaMedicamentoModel.getById(
            tomaId,
            tratamientoMedicamentoId,
            tratamientoId,
            pacienteId
        );
        if (!dataModel) {
            return res.status(404).json({ ok: false, msg: 'Toma de medicamento no encontrada' });
        }

        return res.json({ ok: true, data: formatToma(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { estado, fecha_hora_programada, fecha_hora_registro } = req.body;
        const camposRequeridos = ['fecha_hora_programada'];

        if (faltanCampos(req.body, camposRequeridos)
            || !esFechaHoraValida(fecha_hora_programada)
            || (estado != null && !estadosValidos.includes(estado))
            || (fecha_hora_registro != null && !esFechaHoraValida(fecha_hora_registro))) {
            return res.status(400).json({
                ok: false,
                msg: 'fecha_hora_programada es requerida y debe ser válida; estado debe ser PENDIENTE, TOMADA, OMITIDA o VENCIDA; fecha_hora_registro puede ser null'
            });
        }
        if (!await validarTratamientoMedicamento(req, res)) return;

        const { pacienteId, tratamientoId, tratamientoMedicamentoId } = req.params;
        const tomaId = await TomaMedicamentoModel.create(
            tratamientoMedicamentoId,
            estado,
            normalizarFechaHora(fecha_hora_programada),
            fecha_hora_registro == null ? null : normalizarFechaHora(fecha_hora_registro)
        );
        const dataModel = await TomaMedicamentoModel.getById(
            tomaId,
            tratamientoMedicamentoId,
            tratamientoId,
            pacienteId
        );

        return res.status(201).json({ ok: true, data: formatToma(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { estado, fecha_hora_programada, fecha_hora_registro } = req.body;
        const camposRequeridos = ['estado', 'fecha_hora_programada', 'fecha_hora_registro'];

        if (faltanCampos(req.body, camposRequeridos)
            || !estadosValidos.includes(estado)
            || !esFechaHoraValida(fecha_hora_programada)
            || (fecha_hora_registro != null && !esFechaHoraValida(fecha_hora_registro))) {
            return res.status(400).json({
                ok: false,
                msg: 'Envíe todos los campos; fecha_hora_registro puede ser null y estado debe ser válido'
            });
        }
        if (!await validarTratamientoMedicamento(req, res)) return;

        const { pacienteId, tratamientoId, tratamientoMedicamentoId, tomaId } = req.params;
        if (!esIdValido(tomaId)) {
            return res.status(400).json({ ok: false, msg: 'tomaId debe ser un identificador válido' });
        }

        const dataModel = await TomaMedicamentoModel.update(
            tomaId,
            tratamientoMedicamentoId,
            tratamientoId,
            pacienteId,
            estado,
            normalizarFechaHora(fecha_hora_programada),
            fecha_hora_registro == null ? null : normalizarFechaHora(fecha_hora_registro)
        );
        if (!dataModel) {
            return res.status(404).json({ ok: false, msg: 'Toma de medicamento no encontrada' });
        }

        return res.json({ ok: true, data: formatToma(dataModel) });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const remove = async (req, res) => {
    try {
        if (!await validarTratamientoMedicamento(req, res)) return;

        const { pacienteId, tratamientoId, tratamientoMedicamentoId, tomaId } = req.params;
        if (!esIdValido(tomaId)) {
            return res.status(400).json({ ok: false, msg: 'tomaId debe ser un identificador válido' });
        }

        const resultado = await TomaMedicamentoModel.remove(
            tomaId,
            tratamientoMedicamentoId,
            tratamientoId,
            pacienteId
        );
        if (!resultado) {
            return res.status(404).json({ ok: false, msg: 'Toma de medicamento no encontrada' });
        }

        return res.json({ ok: true, msg: 'Toma de medicamento eliminada correctamente' });
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
