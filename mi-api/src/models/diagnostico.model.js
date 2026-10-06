const pool = require('../config/db');

const consultaDiagnostico = `
    SELECT
        d.id,
        d.paciente_id,
        d.cita_id,
        d.enfermedad_id,
        d.fecha_diagnostico,
        d.observaciones,
        d.estado,
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
    FROM diagnostico d
    INNER JOIN enfermedad e ON d.enfermedad_id = e.id
    INNER JOIN tipo_enfermedad te ON e.tipo_enfermedad_id = te.id
    LEFT JOIN cita c ON d.cita_id = c.id AND c.paciente_id = d.paciente_id
`;

const citaPerteneceAlPaciente = async (citaId, pacienteId) => {
    const [rows] = await pool.query(
        'SELECT id FROM cita WHERE id = ? AND paciente_id = ?',
        [citaId, pacienteId]
    );

    return rows.length > 0;
};

const getAllByPacienteId = async (pacienteId) => {
    const [rows] = await pool.query(
        `${consultaDiagnostico} WHERE d.paciente_id = ? ORDER BY d.fecha_diagnostico DESC, d.id DESC`,
        [pacienteId]
    );

    return rows;
};

const getById = async (diagnosticoId, pacienteId) => {
    const [rows] = await pool.query(
        `${consultaDiagnostico} WHERE d.paciente_id = ? AND d.id = ?`,
        [pacienteId, diagnosticoId]
    );

    return rows[0];
};

const create = async (pacienteId, enfermedadId, citaId, fechaDiagnostico, observaciones) => {
    const citaDiagnostico = citaId ?? null;
    const fecha = fechaDiagnostico ?? null;
    const observacionesDiagnostico = observaciones ?? null;

    const [result] = await pool.query(
        'INSERT INTO diagnostico (paciente_id, cita_id, enfermedad_id, fecha_diagnostico, observaciones) VALUES (?, ?, ?, ?, ?)',
        [pacienteId, citaDiagnostico, enfermedadId, fecha, observacionesDiagnostico]
    );

    return getById(result.insertId, pacienteId);
};

const update = async (diagnosticoId, pacienteId, enfermedadId, citaId, fechaDiagnostico, observaciones, estado) => {
    const citaDiagnostico = citaId ?? null;
    const fecha = fechaDiagnostico ?? null;
    const observacionesDiagnostico = observaciones ?? null;

    const [result] = await pool.query(
        'UPDATE diagnostico SET enfermedad_id = ?, cita_id = ?, fecha_diagnostico = ?, observaciones = ?, estado = ? WHERE id = ? AND paciente_id = ?',
        [enfermedadId, citaDiagnostico, fecha, observacionesDiagnostico, estado, diagnosticoId, pacienteId]
    );

    if (result.affectedRows === 0) {
        const diagnosticoExistente = await getById(diagnosticoId, pacienteId);
        if (!diagnosticoExistente) return null;
    }

    return getById(diagnosticoId, pacienteId);
};

const remove = async (diagnosticoId, pacienteId) => {
    const [result] = await pool.query(
        'DELETE FROM diagnostico WHERE id = ? AND paciente_id = ?',
        [diagnosticoId, pacienteId]
    );

    if (result.affectedRows === 0) return null;

    return { id: diagnosticoId, paciente_id: pacienteId };
};

module.exports = {
    citaPerteneceAlPaciente,
    getAllByPacienteId,
    getById,
    create,
    update,
    remove
};
