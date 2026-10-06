const pool = require('../config/db');

const consultaTratamiento = `
    SELECT
        t.id,
        t.paciente_id,
        t.diagnostico_id,
        t.nombre,
        t.descripcion,
        d.id AS diagnostico_relacionado_id,
        d.enfermedad_id,
        d.fecha_diagnostico,
        d.observaciones AS diagnostico_observaciones,
        d.estado AS diagnostico_estado,
        e.nombre AS enfermedad_nombre,
        e.descripcion AS enfermedad_descripcion,
        e.codigo_cie10 AS enfermedad_codigo_cie10,
        te.id AS tipo_enfermedad_id,
        te.nombre AS tipo_enfermedad_nombre,
        te.descripcion AS tipo_enfermedad_descripcion,
        c.id AS cita_relacionada_id,
        c.fecha_hora AS cita_fecha_hora,
        c.descripcion AS cita_descripcion,
        c.estado AS cita_estado
    FROM tratamiento t
    LEFT JOIN diagnostico d
        ON t.diagnostico_id = d.id AND t.paciente_id = d.paciente_id
    LEFT JOIN enfermedad e ON d.enfermedad_id = e.id
    LEFT JOIN tipo_enfermedad te ON e.tipo_enfermedad_id = te.id
    LEFT JOIN cita c
        ON d.cita_id = c.id AND d.paciente_id = c.paciente_id
`;

const diagnosticoPerteneceAlPaciente = async (diagnosticoId, pacienteId) => {
    const [rows] = await pool.query(
        'SELECT id FROM diagnostico WHERE id = ? AND paciente_id = ?',
        [diagnosticoId, pacienteId]
    );

    return rows.length > 0;
};

const getAllByPacienteId = async (pacienteId) => {
    const [rows] = await pool.query(
        `${consultaTratamiento} WHERE t.paciente_id = ? ORDER BY t.id`,
        [pacienteId]
    );

    return rows;
};

const getById = async (tratamientoId, pacienteId) => {
    const [rows] = await pool.query(
        `${consultaTratamiento} WHERE t.paciente_id = ? AND t.id = ?`,
        [pacienteId, tratamientoId]
    );

    return rows[0];
};

const create = async (pacienteId, diagnosticoId, nombre, descripcion) => {
    const diagnostico = diagnosticoId ?? null;
    const descripcionTratamiento = descripcion ?? null;

    const [result] = await pool.query(
        'INSERT INTO tratamiento (paciente_id, diagnostico_id, nombre, descripcion) VALUES (?, ?, ?, ?)',
        [pacienteId, diagnostico, nombre, descripcionTratamiento]
    );

    return getById(result.insertId, pacienteId);
};

const update = async (tratamientoId, pacienteId, diagnosticoId, nombre, descripcion) => {
    const diagnostico = diagnosticoId ?? null;
    const descripcionTratamiento = descripcion ?? null;

    const [result] = await pool.query(
        'UPDATE tratamiento SET diagnostico_id = ?, nombre = ?, descripcion = ? WHERE id = ? AND paciente_id = ?',
        [diagnostico, nombre, descripcionTratamiento, tratamientoId, pacienteId]
    );

    if (result.affectedRows === 0) {
        const tratamientoExistente = await getById(tratamientoId, pacienteId);
        if (!tratamientoExistente) return null;
    }

    return getById(tratamientoId, pacienteId);
};

const remove = async (tratamientoId, pacienteId) => {
    const [result] = await pool.query(
        'DELETE FROM tratamiento WHERE id = ? AND paciente_id = ?',
        [tratamientoId, pacienteId]
    );

    if (result.affectedRows === 0) return null;

    return { id: tratamientoId, paciente_id: pacienteId };
};

module.exports = {
    diagnosticoPerteneceAlPaciente,
    getAllByPacienteId,
    getById,
    create,
    update,
    remove
};
