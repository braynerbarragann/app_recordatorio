const CitaModel = require('../models/cita.model');

const getAll = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;

        const resultado = await CitaModel.getByUsuarioId(usuarioId);

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
        const item = await CitaModel.getById(req.params.id);

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

module.exports = { getAll, getById };