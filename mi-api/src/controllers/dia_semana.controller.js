const DiaSemanaModel = require('../models/dia_semana.model');

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const getAll = async (req, res) => {
    try {
        const resultado = await DiaSemanaModel.getAll();

        return res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar dia semana'
        });
    }
};

const getById = async (req, res) => {
    try {
        
        const item = await DiaSemanaModel.getById(req.params.id);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'dia semana no encontrado'
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
            msg: 'Error al consultar el dia semana'
        });
    }
};


const create = async (req, res) => {
    try {
        const { id, nombre } = req.body;
        if (faltanCampos(req.body, ['id', 'nombre']) || !Number.isInteger(id) || id < 1 || id > 7 || !nombre)
            return res.status(400).json({ ok: false, msg: 'id (entero entre 1 y 7) y nombre son requeridos' });
      
        const nuevodia_semana =
            await DiaSemanaModel.create(id, nombre);

        return res.status(201).json({
            ok: true,
            data: nuevodia_semana
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el dia semana'
        });
    }
};

const update = async (req, res) =>{
    try {
        const { id } = req.params;
        const { nombre } = req.body

        if (faltanCampos(req.body, ['nombre']) || !nombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre es obligatorio'
            });
        };

        const updatedia_semana = await DiaSemanaModel.update(id, nombre);

        if (!updatedia_semana) {
            return res.status(404).json({
                ok: false,
                msg: 'dia semana no encontrada'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updatedia_semana
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al editar dia semana'
        });
    }
};

const remove = async (req, res) => {
    try {
        const resultado =
            await DiaSemanaModel.remove(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: 'dia semana no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'dia semana eliminada correctamente'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la dia semana'
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
