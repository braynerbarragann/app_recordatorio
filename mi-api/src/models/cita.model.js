const pool = require('../config/db');

const getAllByPacienteId = async (pacienteId) => {
    const [rows] = await pool.query(
        `SELECT c.id, c.paciente_id, c.descripcion, c.fecha_hora, c.estado, 
        tc.id AS tipo_cita_id, tc.nombre AS tipo_cita_nombre, tc.descripcion AS tipo_cita_descripcion
        FROM cita c 
        INNER JOIN tipo_cita tc ON c.tipo_cita_id = tc.id
        WHERE c.paciente_id = ? ORDER BY fecha_hora;`,
        [pacienteId]
    );

    return rows;
};

const getById = async (citaId, pacienteId) => {
    const [rows] = await pool.query(
        `SELECT c.id, c.paciente_id, c.descripcion, c.fecha_hora, c.estado, 
        tc.id AS tipo_cita_id, tc.nombre AS tipo_cita_nombre, tc.descripcion AS tipo_cita_descripcion
        FROM cita c 
        INNER JOIN tipo_cita tc ON c.tipo_cita_id = tc.id
        WHERE c.paciente_id = ? AND  c.id = ?;`,
        [pacienteId, citaId]
    );

    return rows[0];
};

const create = async (pacienteId, tipoCitaId, descripcion, fechaHora) => {
    const descripcionCita = descripcion ?? null;

    const [result] = await pool.query(
        'INSERT INTO cita (paciente_id, tipo_cita_id, descripcion, fecha_hora) VALUES (?, ?, ?, ?)',
        [pacienteId, tipoCitaId, descripcionCita, fechaHora]
    );

    return {
        id: result.insertId,
        paciente_id: pacienteId,
        tipo_cita_id: tipoCitaId,
        descripcion: descripcionCita,
        fecha_hora: fechaHora
    };
};

const update = async (citaId, pacienteId, tipoCitaId, descripcion, fechaHora) => {
    const descripcionCita = descripcion ?? null;

    const [result] = await pool.query(
        'UPDATE cita SET tipo_cita_id = ?, descripcion = ?, fecha_hora = ? WHERE id = ? AND paciente_id = ?',
        [tipoCitaId, descripcionCita, fechaHora, citaId, pacienteId]
    );

    if (result.affectedRows === 0) {
        const citaExistente = await getById(citaId, pacienteId);
        if (!citaExistente) return null;
    }

    return {
        id: citaId,
        paciente_id: pacienteId,
        tipo_cita_id: tipoCitaId,
        descripcion: descripcionCita,
        fecha_hora: fechaHora
    };
};

const remove = async (citaId, pacienteId) => {
    const [result] = await pool.query(
        'DELETE FROM cita WHERE id = ? AND paciente_id = ?',
        [citaId, pacienteId]
    );

    if (result.affectedRows === 0) return null;

    return { id: citaId, paciente_id: pacienteId };
};

module.exports = {
    getAllByPacienteId,
    getById,
    create,
    update,
    remove
};
