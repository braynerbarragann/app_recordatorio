const Via_AdministracionModel = require('../models/via_administracion.model');

const getAll = async (req, res) => {
    try {
        const resultado = await Via_AdministracionModel.getAll();

        return res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
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

        return res.json({
            ok: true,
            data: item
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar la via administracion'
        });
    }
};


const create = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre)
            return res.status(400).json({ ok: false, msg: 'nombre requerido' });
      
        const nuevaViaAdministracion =
            await Via_AdministracionModel.create(nombre, descripcion);

        return res.status(201).json({
            ok: true,
            data: nuevaViaAdministracion
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al crear la via administracion'
        });
    }
};

const update = async (req, res) =>{
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body

        if (!nombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre es obligatorio'
            });
        };

        const updateViaAdministracion = await Via_AdministracionModel.update(id, nombre, descripcion);

        if (!updateViaAdministracion) {
            return res.status(404).json({
                ok: false,
                msg: 'via de administracion no encontrada'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updateViaAdministracion
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al editar via administracion'
        });
    }
};

const remove = async (req, res) => {
    try {
        const resultado =
            await Via_AdministracionModel.remove(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: 'Vía de administración no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Vía de administración eliminada correctamente'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la vía de administración'
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