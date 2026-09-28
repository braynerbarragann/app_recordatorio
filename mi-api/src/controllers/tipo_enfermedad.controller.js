const Tipo_EnfermedadModel = require('../models/tipo_enfermedad.model');

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const getAll = async (req, res) => {
    try {
        const resultado = await Tipo_EnfermedadModel.getAll();

        return res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar tipo enfermedad'
        });
    }
};

const getById = async (req, res) => {
    try {
        
        const item = await Tipo_EnfermedadModel.getById(req.params.id);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo enfermedad no encontrado'
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
            msg: 'Error al consultar el tipo enfermedad'
        });
    }
};


const create = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (faltanCampos(req.body, ['nombre']) || !nombre)
            return res.status(400).json({ ok: false, msg: 'nombre requerido' });
      
        const nuevoTipoEnfermedad =
            await Tipo_EnfermedadModel.create(nombre, descripcion);

        return res.status(201).json({
            ok: true,
            data: nuevoTipoEnfermedad
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el tipo enfermedad'
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

        const updateTipoEnfermedad = await Tipo_EnfermedadModel.update(id, nombre, descripcion);

        if (!updateTipoEnfermedad) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo enfermedad no encontrada'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updateTipoEnfermedad
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al editar tipo enfermedad'
        });
    }
};

const remove = async (req, res) => {
    try {
        const resultado =
            await Tipo_EnfermedadModel.remove(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo enfermedad no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'tipo enfermedad eliminada correctamente'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la tipo enfermedad'
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
