const Via_AdministracionModel = require('../models/via_administracion.model');

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const getAll = async (req, res) => {
    try {
        const resultado = await Via_AdministracionModel.getAll();

        return res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({ ok: false, msg: error.message });
    }
};

const getById = async (req, res) => {
    try {
        
        const item = await Via_AdministracionModel.getById(req.params.id);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'Vía de administración no encontrada'
            });
        }

        return res.json({
            ok: true,
            data: item
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({ ok: false, msg: error.message });
    }
};


const create = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (faltanCampos(req.body, ['nombre']) || !nombre)
            return res.status(400).json({ ok: false, msg: 'nombre es requerido' });
      
        const nuevaViaAdministracion =
            await Via_AdministracionModel.create(nombre, descripcion);

        return res.status(201).json({
            ok: true,
            data: nuevaViaAdministracion
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({ ok: false, msg: error.message });
    }
};

const update = async (req, res) =>{
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body

        if (faltanCampos(req.body, ['nombre', 'descripcion']) || !nombre) {
            return res.status(400).json({
                ok: false,
                msg: 'nombre es requerido y descripcion debe enviarse; puede ser null'
            });
        };

        const updateViaAdministracion = await Via_AdministracionModel.update(id, nombre, descripcion);

        if (!updateViaAdministracion) {
            return res.status(404).json({
                ok: false,
                msg: 'Vía de administración no encontrada'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updateViaAdministracion
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({ ok: false, msg: error.message });
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
