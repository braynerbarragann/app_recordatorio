const pool = require('../config/db');

const consultaUsuarioPaciente = `
SELECT
    -- Todos los campos de usuario_paciente
    up.id AS usuario_paciente_id,
    up.usuario_id,
    up.paciente_id,
    up.tipo_relacion_id,
    up.fecha_vinculacion,
    up.estado AS vinculacion_estado,

    -- Datos de paciente 
    p.nombre AS paciente_nombre,
    p.numero_documento,
    p.fecha_nacimiento,
    p.direccion,
    p.estado AS paciente_estado,

    -- Todos los campos de tipo_documento
    td.id AS tipo_documento_id,
    td.nombre AS tipo_documento_nombre,
    td.abreviatura AS tipo_documento_abreviatura,

    -- Todos los campos de genero
    g.id AS genero_id,
    g.nombre AS genero_nombre,
    g.abreviatura AS genero_abreviatura,

    tr.nombre AS tipo_relacion_nombre

FROM usuario_paciente up

INNER JOIN paciente p
    ON up.paciente_id = p.id

INNER JOIN tipo_documento td
    ON p.tipo_documento_id = td.id

INNER JOIN genero g
    ON p.genero_id = g.id

INNER JOIN tipo_relacion tr
    ON up.tipo_relacion_id = tr.id
`;


const getAllByUsuarioId = async (usuarioId) => {
    const [rows] = await pool.query(
        `${consultaUsuarioPaciente} WHERE up.usuario_id = ? ORDER BY up.usuario_id;`,
        [usuarioId]
    );

    return rows;
};

const getById = async (usuarioId, pacienteId) => {
    const [rows] = await pool.query(
        `${consultaUsuarioPaciente} WHERE up.usuario_id = ? AND up.paciente_id = ? 
        ORDER BY up.usuario_id;`,
        [usuarioId, pacienteId]
    );

    return rows[0];
};

const create = async (usuarioId, pacienteId, tipoRelacionId) => {

    const [result] = await pool.query(
        'INSERT INTO usuario_paciente (usuario_id, paciente_id, tipo_relacion_id) VALUES (?, ?, ?)',
        [usuarioId, pacienteId, tipoRelacionId]
    );

    return {
        id: result.insertId,
        usuario_id: usuarioId,
        paciente_id: pacienteId,
        tipo_relacion_id: tipoRelacionId
    };
};

const update = async (usuarioId, pacienteId, tipoRelacionId, estado) => {

    const [result] = await pool.query(
        `
        UPDATE usuario_paciente SET tipo_relacion_id = ?, estado = ? 
        WHERE usuario_id = ? AND paciente_id = ?`,
        [tipoRelacionId, estado, usuarioId, pacienteId]
    );

    if (result.affectedRows === 0) {
        const relacionExistente = await getById(usuarioId, pacienteId);
        if (!relacionExistente) return null;
    }

    return {
        usuario_id: usuarioId,
        paciente_id: pacienteId,
        tipo_relacion_id: tipoRelacionId,
        estado: estado
    };
};

const remove = async (usuarioId, pacienteId) => {
    const [result] = await pool.query(
        'DELETE FROM usuario_paciente WHERE usuario_id = ? AND paciente_id = ?',
        [usuarioId, pacienteId]
    );

    if (result.affectedRows === 0) return null;

    return { usuario_id: usuarioId, paciente_id: pacienteId };
};

module.exports = {
    getAllByUsuarioId,
    getById,
    create,
    update,
    remove
};