const Tipo_frecuenciaModel = require('../models/tipo_frecuencia.model');

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const getAll = async (req, res) => {
    try {
        const resultado = await Tipo_frecuenciaModel.getAll();

        return res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar tipo frecuencia'
        });
    }
};

const getById = async (req, res) => {
    try {
        
        const item = await Tipo_frecuenciaModel.getById(req.params.id);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo frecuencia no encontrado'
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
            msg: 'Error al consultar el tipo frecuencia'
        });
    }
};


const create = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (faltanCampos(req.body, ['nombre']) || !nombre)
            return res.status(400).json({ ok: false, msg: 'nombre requerido' });
      
        const nuevoTipofrecuencia =
            await Tipo_frecuenciaModel.create(nombre, descripcion);

        return res.status(201).json({
            ok: true,
            data: nuevoTipofrecuencia
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el tipo frecuencia'
        });
    }
};

const update = async (req, res) =>{
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body

        if (faltanCampos(req.body, ['nombre', 'descripcion']) || !nombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre es obligatorio'
            });
        };

        const updateTipofrecuencia = await Tipo_frecuenciaModel.update(id, nombre, descripcion);

        if (!updateTipofrecuencia) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo frecuencia no encontrada'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updateTipofrecuencia
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al editar tipo frecuencia'
        });
    }
};

const remove = async (req, res) => {
    try {
        const resultado =
            await Tipo_frecuenciaModel.remove(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo frecuencia no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'tipo frecuencia eliminada correctamente'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la tipo frecuencia'
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
