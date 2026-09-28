const tipo_citaModel = require('../models/tipo_cita.model');

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const getAll = async (req, res) => {
    try {
        const resultado = await tipo_citaModel.getAll();

        return res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar tipo cita'
        });
    }
};

const getById = async (req, res) => {
    try {
        
        const item = await tipo_citaModel.getById(req.params.id);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo cita no encontrado'
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
            msg: 'Error al consultar el tipo cita'
        });
    }
};


const create = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (faltanCampos(req.body, ['nombre']) || !nombre)
            return res.status(400).json({ ok: false, msg: 'nombre requerido' });
      
        const nuevoTipoCita =
            await tipo_citaModel.create(nombre, descripcion);

        return res.status(201).json({
            ok: true,
            data: nuevoTipoCita
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el tipo cita'
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

        const updateTipocita = await tipo_citaModel.update(id, nombre, descripcion);

        if (!updateTipocita) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo cita no encontrada'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updateTipocita
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al editar tipo cita'
        });
    }
};

const remove = async (req, res) => {
    try {
        const resultado =
            await tipo_citaModel.remove(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo cita no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'tipo cita eliminada correctamente'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la tipo cita'
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
