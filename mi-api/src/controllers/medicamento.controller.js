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



const create = async (req, res) => {
    try {
        const {nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion} = req.body;
        
        if (!nombre || !presentacion || !concentracion_valor || !concentracion_unidad)
            return res.status(400).json({ ok: false, msg: 'nombre, presentacion y concentracion_valor, concentracion_unidad, requerido' });
              
        const nuevaMedicamento = await MedicamentoModel.create(nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion);
        
        res.status(201).json({
            ok: true,
            data: nuevaMedicamento
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al crear el medicamento'
        });
    }
};

const update = async (req, res) =>{
    try {
        const { id } = req.params;
        const { nombre, presentacion, concentracion_valor, concentracion_unidad,  descripcion } = req.body

        if (!nombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre es obligatorio'
            });
        };

        const updateMedicamento = await MedicamentoModel.update(id, nombre, presentacion, concentracion_valor, concentracion_unidad,  descripcion);

        if (!updateMedicamento) {
            return res.status(404).json({
                ok: false,
                msg: 'medicamento no encontrado'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updateMedicamento
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al editar medicamento'
        });
    }
};

const remove = async (req, res) => {
    try {
        const resultado =
            await MedicamentoModel.remove(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: 'medicamento no encontrado'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'medicamento eliminado correctamente'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el medicamento'
        });
    }
};


module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};