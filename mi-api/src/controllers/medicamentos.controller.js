const MedicamentoModel = require('../models/medicamento.model');

const getAll = async (req, res) => {
    try {
        const resultado = await MedicamentoModel.getAll();

        res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al consultar los medicamentos'
        });
    }
};

const getById = async (req, res) => {
    try {
        const item = await MedicamentoModel.getById(req.params.id);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'Medicamento no encontrado'
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
            msg: 'Error al consultar el medicamento'
        });
    }
};

const getByUsuarioId = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;

        const resultado =
            await MedicamentoModel.getByUsuarioId(usuarioId);

        res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al consultar los medicamentos del usuario'
        });
    }
};

const create = async (req, res) => {
    try {
        const nuevoMedicamento =
            await MedicamentoModel.create(req.body);

        res.status(201).json({
            ok: true,
            data: nuevoMedicamento
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al crear el medicamento'
        });
    }
};

module.exports = {
    getAll,
    getById,
    getByUsuarioId,
    create
};