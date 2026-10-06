const GeneroModel = require('../models/genero.model');

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const getAll = async (req, res) => {
    try {
        const resultado = await GeneroModel.getAll();

        return res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar genero'
        });
    }
};

const getById = async (req, res) => {
    try {
        
        const item = await GeneroModel.getById(req.params.id);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'genero no encontrado'
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
            msg: 'Error al consultar el genero'
        });
    }
};


const create = async (req, res) => {
    try {
        const { nombre, abreviatura } = req.body;
        if (faltanCampos(req.body, ['nombre']) || !nombre)
            return res.status(400).json({ ok: false, msg: 'nombre requerido' });
      
        const nuevoGenero =
            await GeneroModel.create(nombre, abreviatura);

        return res.status(201).json({
            ok: true,
            data: nuevoGenero
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el genero'
        });
    }
};

const update = async (req, res) =>{
    try {
        const { id } = req.params;
        const { nombre, abreviatura } = req.body

        if (faltanCampos(req.body, ['nombre', 'abreviatura']) || !nombre) {
            return res.status(400).json({
                ok: false,
                msg: 'Todos los campos son obligatorios; abreviatura puede ser null'
            });
        };

        const updateGenero = await GeneroModel.update(id, nombre, abreviatura);

        if (!updateGenero) {
            return res.status(404).json({
                ok: false,
                msg: 'genero no encontrada'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updateGenero
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al editar genero'
        });
    }
};

const remove = async (req, res) => {
    try {
        const resultado =
            await GeneroModel.remove(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: 'genero no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'genero eliminada correctamente'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la genero'
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
