const TrataminetoModel = require('../models/tratamiento.model');

const getAllByUsuarioId = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;

        const resultado = await TrataminetoModel.getAllByUsuarioId(usuarioId);

        res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al consultar tratamientos'
        });
    }
};

const getById = async (req, res) => {
    try {
        const item = await TrataminetoModel.getById(req.params.id, req.params.usuarioId);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'Tratamiento no encontrada'
            });
        }

        res.json({
            ok: true,
            data: item
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al consultar tratamiento'
        });
    }
};



const create = async (req, res) => {
    try {
        const {nombre, descripcion} = req.body;
        const usuarioId = req.params.usuarioId;

        if (!usuarioId || !nombre)
            return res.status(400).json({ ok: false, msg: 'usuario_id y nombre requerido' });
      
        const nuevoTratamientoModel=
            await TrataminetoModel.create(usuarioId, nombre, descripcion);

        res.status(201).json({
            ok: true,
            data: nuevoTratamientoModel
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al crear tratamiento'
        });
    }
};

module.exports = {
    getAllByUsuarioId,
    getById,
    create
};