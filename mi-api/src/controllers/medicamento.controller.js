const MedicamentoModel = require('../models/medicamento.model');

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const concentracionValida = valor =>
    valor == null || (typeof valor === 'number' && Number.isFinite(valor) && valor > 0);

const getAll = async (req, res) => {
    try {
        const resultado = await MedicamentoModel.getAll();

        return res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: error.message
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

        return res.json({
            ok: true,
            data: item
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: error.message
        });
    }
};



const create = async (req, res) => {
    try {
        const { nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion } = req.body;
        
        if (faltanCampos(req.body, ['nombre']) || !nombre)
            return res.status(400).json({ ok: false, msg: 'nombre es requerido' });

        if (!concentracionValida(concentracion_valor))
            return res.status(400).json({ ok: false, msg: 'concentracion_valor debe ser un número mayor que cero o null' });
              
        const nuevaMedicamento = await MedicamentoModel.create(nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion);
        
        return res.status(201).json({
            ok: true,
            data: nuevaMedicamento
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: error.message
        });
    }
};

const update = async (req, res) =>{
    try {
        const { id } = req.params;
        const { nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion } = req.body

        const camposRequeridos = [
            'nombre',
            'presentacion',
            'concentracion_valor',
            'concentracion_unidad',
            'descripcion'
        ];

        if (faltanCampos(req.body, camposRequeridos) || !nombre) {
            return res.status(400).json({
                ok: false,
                msg: 'Todos los campos deben enviarse; los opcionales pueden ser null'
            });
        };

        if (!concentracionValida(concentracion_valor))
            return res.status(400).json({ ok: false, msg: 'concentracion_valor debe ser un número mayor que cero o null' });

        const updateMedicamento = await MedicamentoModel.update(id, nombre, presentacion, concentracion_valor, concentracion_unidad, descripcion);

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

        return res.status(500).json({ ok: false, msg: error.message });
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

        return res.status(500).json({ ok: false, msg: error.message });
    }
};


module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
