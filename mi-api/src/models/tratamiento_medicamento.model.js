const pool = require('../config/db');

const consultaTratamientoMedicamento = `
    SELECT
        tm.id,
        tm.tratamiento_id,
        tm.medicamento_id,
        tm.via_administracion_id,
        tm.tipo_frecuencia_id,
        tm.instruccion,
        tm.dosis,
        tm.unidad_dosis,
        tm.intervalo_horas,
        tm.fecha_inicio,
        tm.fecha_fin,
        m.nombre AS medicamento_nombre,
        m.presentacion AS medicamento_presentacion,
        m.concentracion_valor AS medicamento_concentracion_valor,
        m.concentracion_unidad AS medicamento_concentracion_unidad,
        m.descripcion AS medicamento_descripcion,
        va.nombre AS via_administracion_nombre,
        va.descripcion AS via_administracion_descripcion,
        tf.nombre AS tipo_frecuencia_nombre,
        tf.descripcion AS tipo_frecuencia_descripcion
    FROM tratamiento_medicamento tm
    INNER JOIN tratamiento t ON tm.tratamiento_id = t.id
    INNER JOIN medicamento m ON tm.medicamento_id = m.id
    INNER JOIN via_administracion va ON tm.via_administracion_id = va.id
    INNER JOIN tipo_frecuencia tf ON tm.tipo_frecuencia_id = tf.id
`;

const tratamientoPerteneceAlPaciente = async (tratamientoId, pacienteId) => {
    const [rows] = await pool.query(
        'SELECT id FROM tratamiento WHERE id = ? AND paciente_id = ?',
        [tratamientoId, pacienteId]
    );

    return rows.length > 0;
};

const getAllByTratamientoId = async (tratamientoId, pacienteId) => {
    const [rows] = await pool.query(
        `${consultaTratamientoMedicamento} WHERE tm.tratamiento_id = ? AND t.paciente_id = ? ORDER BY tm.id`,
        [tratamientoId, pacienteId]
    );

    return rows;
};

const getById = async (tratamientoMedicamentoId, tratamientoId, pacienteId) => {
    const [rows] = await pool.query(
        `${consultaTratamientoMedicamento} WHERE tm.id = ? AND tm.tratamiento_id = ? AND t.paciente_id = ?`,
        [tratamientoMedicamentoId, tratamientoId, pacienteId]
    );

    return rows[0];
};

const create = async (
    tratamientoId,
    pacienteId,
    medicamentoId,
    viaAdministracionId,
    tipoFrecuenciaId,
    instruccion,
    dosis,
    unidadDosis,
    intervaloHoras,
    fechaInicio,
    fechaFin
) => {
    const instruccionTratamiento = instruccion ?? null;
    const intervalo = intervaloHoras ?? null;
    const fechaFinal = fechaFin ?? null;

    const [result] = await pool.query(
        `INSERT INTO tratamiento_medicamento
            (tratamiento_id, medicamento_id, via_administracion_id, tipo_frecuencia_id,
             instruccion, dosis, unidad_dosis, intervalo_horas, fecha_inicio, fecha_fin)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            tratamientoId,
            medicamentoId,
            viaAdministracionId,
            tipoFrecuenciaId,
            instruccionTratamiento,
            dosis,
            unidadDosis,
            intervalo,
            fechaInicio,
            fechaFinal
        ]
    );

    return getById(result.insertId, tratamientoId, pacienteId);
};

const update = async (
    tratamientoMedicamentoId,
    tratamientoId,
    pacienteId,
    medicamentoId,
    viaAdministracionId,
    tipoFrecuenciaId,
    instruccion,
    dosis,
    unidadDosis,
    intervaloHoras,
    fechaInicio,
    fechaFin
) => {
    const instruccionTratamiento = instruccion ?? null;
    const intervalo = intervaloHoras ?? null;
    const fechaFinal = fechaFin ?? null;

    const [result] = await pool.query(
        `UPDATE tratamiento_medicamento
         SET medicamento_id = ?, via_administracion_id = ?, tipo_frecuencia_id = ?,
             instruccion = ?, dosis = ?, unidad_dosis = ?, intervalo_horas = ?,
             fecha_inicio = ?, fecha_fin = ?
         WHERE id = ? AND tratamiento_id = ? AND tratamiento_id IN (
             SELECT id FROM tratamiento WHERE paciente_id = ?
         )`,
        [
            medicamentoId,
            viaAdministracionId,
            tipoFrecuenciaId,
            instruccionTratamiento,
            dosis,
            unidadDosis,
            intervalo,
            fechaInicio,
            fechaFinal,
            tratamientoMedicamentoId,
            tratamientoId,
            pacienteId
        ]
    );

    if (result.affectedRows === 0) {
        const medicamentoExistente = await getById(tratamientoMedicamentoId, tratamientoId, pacienteId);
        if (!medicamentoExistente) return null;
    }

    return getById(tratamientoMedicamentoId, tratamientoId, pacienteId);
};

const remove = async (tratamientoMedicamentoId, tratamientoId, pacienteId) => {
    const [result] = await pool.query(
        `DELETE tm FROM tratamiento_medicamento tm
         INNER JOIN tratamiento t ON tm.tratamiento_id = t.id
         WHERE tm.id = ? AND tm.tratamiento_id = ? AND t.paciente_id = ?`,
        [tratamientoMedicamentoId, tratamientoId, pacienteId]
    );

    if (result.affectedRows === 0) return null;

    return { id: tratamientoMedicamentoId, tratamiento_id: tratamientoId };
};

module.exports = {
    tratamientoPerteneceAlPaciente,
    getAllByTratamientoId,
    getById,
    create,
    update,
    remove
};
