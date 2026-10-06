const pool = require('../config/db');

const consultaTomaMedicamento = `
    SELECT
        tm.id,
        tm.tratamiento_medicamento_id,
        tm.estado,
        tm.fecha_hora_programada,
        tm.fecha_hora_registro
    FROM toma_medicamento tm
    INNER JOIN tratamiento_medicamento tmed
        ON tm.tratamiento_medicamento_id = tmed.id
    INNER JOIN tratamiento t ON tmed.tratamiento_id = t.id
`;

const tratamientoMedicamentoPerteneceAlPaciente = async (
    tratamientoMedicamentoId,
    tratamientoId,
    pacienteId
) => {
    const [rows] = await pool.query(
        `SELECT tmed.id
         FROM tratamiento_medicamento tmed
         INNER JOIN tratamiento t ON tmed.tratamiento_id = t.id
         WHERE tmed.id = ? AND tmed.tratamiento_id = ? AND t.paciente_id = ?`,
        [tratamientoMedicamentoId, tratamientoId, pacienteId]
    );

    return rows.length > 0;
};

const getAll = async (tratamientoMedicamentoId, tratamientoId, pacienteId) => {
    const [rows] = await pool.query(
        `${consultaTomaMedicamento}
         WHERE tm.tratamiento_medicamento_id = ?
           AND tmed.tratamiento_id = ?
           AND t.paciente_id = ?
         ORDER BY tm.fecha_hora_programada, tm.id`,
        [tratamientoMedicamentoId, tratamientoId, pacienteId]
    );

    return rows;
};

const getById = async (tomaId, tratamientoMedicamentoId, tratamientoId, pacienteId) => {
    const [rows] = await pool.query(
        `${consultaTomaMedicamento}
         WHERE tm.id = ?
           AND tm.tratamiento_medicamento_id = ?
           AND tmed.tratamiento_id = ?
           AND t.paciente_id = ?`,
        [tomaId, tratamientoMedicamentoId, tratamientoId, pacienteId]
    );

    return rows[0];
};

const create = async (
    tratamientoMedicamentoId,
    estado,
    fechaHoraProgramada,
    fechaHoraRegistro
) => {
    const estadoToma = estado ?? 'PENDIENTE';
    const fechaRegistro = fechaHoraRegistro ?? null;

    const [result] = await pool.query(
        `INSERT INTO toma_medicamento
            (tratamiento_medicamento_id, estado, fecha_hora_programada, fecha_hora_registro)
         VALUES (?, ?, ?, ?)`,
        [tratamientoMedicamentoId, estadoToma, fechaHoraProgramada, fechaRegistro]
    );

    return result.insertId;
};

const update = async (
    tomaId,
    tratamientoMedicamentoId,
    tratamientoId,
    pacienteId,
    estado,
    fechaHoraProgramada,
    fechaHoraRegistro
) => {
    const fechaRegistro = fechaHoraRegistro ?? null;

    const [result] = await pool.query(
        `UPDATE toma_medicamento tm
         INNER JOIN tratamiento_medicamento tmed
             ON tm.tratamiento_medicamento_id = tmed.id
         INNER JOIN tratamiento t ON tmed.tratamiento_id = t.id
         SET tm.estado = ?, tm.fecha_hora_programada = ?, tm.fecha_hora_registro = ?
         WHERE tm.id = ?
           AND tm.tratamiento_medicamento_id = ?
           AND tmed.tratamiento_id = ?
           AND t.paciente_id = ?`,
        [
            estado,
            fechaHoraProgramada,
            fechaRegistro,
            tomaId,
            tratamientoMedicamentoId,
            tratamientoId,
            pacienteId
        ]
    );

    if (result.affectedRows === 0) {
        const tomaExistente = await getById(
            tomaId,
            tratamientoMedicamentoId,
            tratamientoId,
            pacienteId
        );
        if (!tomaExistente) return null;
    }

    return getById(tomaId, tratamientoMedicamentoId, tratamientoId, pacienteId);
};

const remove = async (tomaId, tratamientoMedicamentoId, tratamientoId, pacienteId) => {
    const [result] = await pool.query(
        `DELETE tm FROM toma_medicamento tm
         INNER JOIN tratamiento_medicamento tmed
             ON tm.tratamiento_medicamento_id = tmed.id
         INNER JOIN tratamiento t ON tmed.tratamiento_id = t.id
         WHERE tm.id = ?
           AND tm.tratamiento_medicamento_id = ?
           AND tmed.tratamiento_id = ?
           AND t.paciente_id = ?`,
        [tomaId, tratamientoMedicamentoId, tratamientoId, pacienteId]
    );

    if (result.affectedRows === 0) return null;

    return { id: tomaId, tratamiento_medicamento_id: tratamientoMedicamentoId };
};

module.exports = {
    tratamientoMedicamentoPerteneceAlPaciente,
    getAll,
    getById,
    create,
    update,
    remove
};
