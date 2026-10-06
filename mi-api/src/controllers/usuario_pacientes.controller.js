const usuarioPacienteModel = require('../models/usuario_paciente.model');

const estadosValidos = ['ACTIVO', 'INACTIVO'];

const formatUsuarioPaciente = (uP) => ({
    
    "id": uP.usuario_paciente_id,
    "fecha_vinculacion": uP.fecha_vinculacion,
    "estado": uP.vinculacion_estado,
    "paciente": {
        "id": uP.paciente_id,
        "tipo_documento": {
            "id": uP.tipo_documento_id,
            "nombre": uP.tipo_documento_nombre,
            "abreviatura": uP.tipo_documento_abreviatura
        },
        "genero": {
            "id": uP.genero_id,
            "nombre": uP.genero_nombre,
            "abreviatura": uP.genero_abreviatura
        },
        "numero_documento": uP.numero_documento,
        "nombre": uP.paciente_nombre,
        "fecha_nacimiento": uP.fecha_nacimiento,
        "direccion": uP.direccion,
        "estado": uP.paciente_estado
    },
    "tipo_relacion": {
        "id": uP.tipo_relacion_id,
        "nombre": uP.tipo_relacion_nombre
    }

});

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const getAllByUsuarioId = async (req, res) => {
    try {
        const usuarioId = req.usuario.usuario_id;
        const dataModel = await usuarioPacienteModel.getAllByUsuarioId(usuarioId);
        const data = dataModel.map(formatUsuarioPaciente);

        return res.json({ ok: true, data });
    } catch (err) {

        return res.status(500).json({ ok: false, msg: err.message });

    }
};

const getById = async (req, res) => {
    try {
        const dataModel = await usuarioPacienteModel.getById(req.params.usuarioId, req.params.pacienteId);
        if (!dataModel) {
            return res.status(404).json({ ok: false, msg: 'Relacion no encontrada' });
        }

        const data = formatUsuarioPaciente(dataModel)

        return res.json({ ok: true, data });
    } catch (err) {

        return res.status(500).json({ ok: false, msg: err.message });

    }
};

const create = async (req, res) => {
    try {
        const { paciente_id, tipo_relacion_id } = req.body;
        const usuarioId = req.params.usuarioId;

        const camposRequeridos = ['paciente_id','tipo_relacion_id'];

        if (faltanCampos(req.body, camposRequeridos) || !paciente_id || !usuarioId || !tipo_relacion_id) {
            return res.status(400).json({
                ok: false,
                msg: 'tipo_relacion_id, usuario_id y paciente_id son requeridos.'
            });
        }

        const data = await usuarioPacienteModel.create(usuarioId, paciente_id,tipo_relacion_id);
        return res.status(201).json({ ok: true, data });
    } catch (err) {

        return res.status(500).json({ ok: false, msg: err.message });

    }
};

const update = async (req, res) => {
    try {
        const { usuarioId, pacienteId } = req.params;
        const {tipo_relacion_id, estado} = req.body;
        const camposRequeridos = ["tipo_relacion_id", "estado"];

        if (faltanCampos(req.body, camposRequeridos)
            || !pacienteId || !usuarioId
            || !tipo_relacion_id || !estadosValidos.includes(estado)) {
            return res.status(400).json({
                ok: false,
                msg: 'tipo_relacion_id es requerido y estado debe ser ACTIVO o INACTIVO'
            });
        }

        const data = await usuarioPacienteModel.update(usuarioId, pacienteId, tipo_relacion_id, estado);
        if (!data) {
            return res.status(404).json({ ok: false, msg: 'Relacion no encontrada' });
        }

        return res.json({ ok: true, data });
    } catch (err) {

        return res.status(500).json({ ok: false, msg: err.message });

    }
};

const remove = async (req, res) => {

    try {
        const resultado = await usuarioPacienteModel.remove(req.params.usuarioId, req.params.pacienteId);
        if (!resultado) {
            return res.status(404).json({ ok: false, msg: 'Relacion no encontrada' });
        }

        return res.json({ ok: true, msg: 'Relacion eliminada correctamente' });
    } catch (err) {

        return res.status(500).json({ ok: false, msg: err.message });

    }
};

module.exports = {
    getAllByUsuarioId,
    getById,
    create,
    update,
    remove
};
