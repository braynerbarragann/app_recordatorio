const TipoRelacionModel = require('../models/tipo_relacion.model');

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const getAll = async (req, res) => {
    try {
        const resultado = await TipoRelacionModel.getAll();

        return res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar tipo relacion'
        });
    }
};

const getById = async (req, res) => {
    try {
        
        const item = await TipoRelacionModel.getById(req.params.id);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo relacion no encontrado'
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
            msg: 'Error al consultar el tipo relacion'
        });
    }
};


const create = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (faltanCampos(req.body, ['nombre']) || !nombre)
            return res.status(400).json({ ok: false, msg: 'nombre requerido' });
      
        const nuevotipo_relacion =
            await TipoRelacionModel.create(nombre);

        return res.status(201).json({
            ok: true,
            data: nuevotipo_relacion
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el tipo relacion'
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

        const updatetipo_relacion = await TipoRelacionModel.update(id, nombre);

        if (!updatetipo_relacion) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo relacion no encontrada'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updatetipo_relacion
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al editar tipo relacion'
        });
    }
};

const remove = async (req, res) => {
    try {
        const resultado =
            await TipoRelacionModel.remove(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo relacion no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'tipo relacion eliminada correctamente'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la tipo relacion'
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
