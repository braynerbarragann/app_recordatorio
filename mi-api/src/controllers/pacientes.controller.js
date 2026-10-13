const PacienteModel = require('../models/paciente.model')
const UsuarioPacienteModel = require('../models/usuario_paciente.model');

const formatPaciente = (p) => ({
    id: p.id,
    tipo_documento: {
        id: p.tipo_documento_id,
        nombre: p.tipo_documento,
        abreviatura: p.tipo_documento_abreviatura
    },
    genero: {
        id: p.genero_id,
        nombre: p.genero,
        abreviatura: p.genero_abreviatura
    },
    nombre: p.nombre,
    numero_documento: p.numero_documento,
    fecha_nacimiento: p.fecha_nacimiento,
    direccion: p.direccion,
    estado: p.estado
});



const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};



const getById = async (req, res) => {
    try {
        const usuarioId = req.usuario.usuario_id;
        const pacienteId = req.params.id;

        const pacienteModel = await PacienteModel.getById(usuarioId, pacienteId);
        if (!pacienteModel) return res.status(404)
            .json({ ok: false, msg: 'Paciente no encontrado' });

        const data = formatPaciente(pacienteModel)

        return res.json({ ok: true, data });
    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const create = async (req, res) => {
    try {
        const usuarioId = req.usuario.usuario_id;
        const { tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion, tipo_relacion_id } = req.body;

        const camposRequeridos = [
            'tipo_documento_id',
            'genero_id',
            'nombre',
            'numero_documento',
            'tipo_relacion_id'
        ];
        const faltaCampo = faltanCampos(req.body, camposRequeridos);

        if (faltaCampo || tipo_documento_id == null || genero_id == null || !nombre || !numero_documento || !tipo_relacion_id)
            return res.status(400).json({ ok: false, msg: 'nombre, numero de documento, tipo relacion, tipo documento y genero son requeridos' });

        const create = await PacienteModel.create(tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion, usuarioId, tipo_relacion_id);

        const data  = formatPaciente(create);

        return res.status(201).json({ ok: true, data });

    } catch (err) {
        return res.status(500).json({ ok: false, msg: err.message });
    }
};

const update = async (req, res) => {
    try {
        const usuarioId = req.usuario.usuario_id;
        const pacienteId = req.params.id;

        const dataModel = await UsuarioPacienteModel.getById(usuarioId, pacienteId);
        if(!dataModel){
            return res.status(404).json({
                ok: false,
                msg: 'Relacion no encontrada'
            });
        }

        const { tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion } = req.body

        const camposRequeridos = [
            'tipo_documento_id',
            'genero_id',
            'nombre',
            'numero_documento',
            'fecha_nacimiento',
            'direccion'
        ];
        const faltaCampo = faltanCampos(req.body, camposRequeridos);

        if (faltaCampo || tipo_documento_id == null || genero_id == null || !nombre || !numero_documento)
            return res.status(400).json({ ok: false, msg: 'Todos los campos del paciente son requeridos; fecha_nacimiento y direccion pueden ser null' });

        const updatePaciente = await PacienteModel.update(tipo_documento_id, genero_id, nombre, numero_documento, fecha_nacimiento, direccion, usuarioId, pacienteId);

        if (!updatePaciente) {
            return res.status(404).json({
                ok: false,
                msg: 'Paciente no encontrado'
            });
        };

        const data = formatPaciente(updatePaciente);

        return res.status(200).json({
            ok: true,
            data: data
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            ok: false,
            msg: err.message
        });
    }
};




module.exports = {getById, create, update};
