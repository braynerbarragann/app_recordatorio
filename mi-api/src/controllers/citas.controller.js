const CitaModel = require('../models/cita.model');

const getAllByUsuarioId = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;

        const resultado = await CitaModel.getAllByUsuarioId(usuarioId);

        res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al consultar las citas'
        });
    }
};

const getById = async (req, res) => {
    try {
        const item = await CitaModel.getById(req.params.id, req.params.usuarioId);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'Cita no encontrada'
            });
        }

        res.json({
            ok: true,
            data: item
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al consultar la cita'
        });
    }
};



const create = async (req, res) => {
    try {
        const {descripcion, fecha_hora, estado} = req.body;
        const usuario_id = req.params.usuarioId;
        if (!usuario_id || !fecha_hora)
            return res.status(400).json({ ok: false, msg: 'usuario_id y fecha_hora requerido' });
      
        const nuevaCitaModel=
            await CitaModel.create(usuario_id, descripcion, fecha_hora, estado);

        res.status(201).json({
            ok: true,
            data: nuevaCitaModel
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al crear cita'
        });
    }
};

module.exports = {
    getAllByUsuarioId,
    getById,
    create
};