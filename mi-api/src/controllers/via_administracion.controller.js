const Via_AdministracionModel = require('../models/via_administracion.model');

const getAll = async (req, res) => {
    try {
        const resultado = await Via_AdministracionModel.getAll();

        res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al consultar via administracion'
        });
    }
};

const getById = async (req, res) => {
    try {
        const item = await Via_AdministracionModel.getById(req.params.id);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'via administracion no encontrado'
            });
        }

        res.json({
            ok: true,
            data: item
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al consultar la via administracion'
        });
    }
};

const getByUsuarioId = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;

        const resultado =
            await Via_AdministracionModel.getByUsuarioId(usuarioId);

        res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al consultar las vias administracion del usuario'
        });
    }
};

const create = async (req, res) => {
    try {
        const nuevaViaAdministracion =
            await Via_AdministracionModel.create(req.body);

        res.status(201).json({
            ok: true,
            data: nuevaViaAdministracion
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al crear la via administracion'
        });
    }
};

module.exports = {
    getAll,
    getById,
    getByUsuarioId,
    create
};