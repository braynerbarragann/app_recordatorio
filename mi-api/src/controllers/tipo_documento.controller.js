const TipoDocumentoModel = require('../models/tipo_documento.model');

const getAll = async (req, res) => {
    try {
        const resultado = await TipoDocumentoModel.getAll();

        return res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar tipo documento'
        });
    }
};

const getById = async (req, res) => {
    try {
        
        const item = await TipoDocumentoModel.getById(req.params.id);

        if (!item) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo documento no encontrado'
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
            msg: 'Error al consultar el tipo documento'
        });
    }
};


const create = async (req, res) => {
    try {
        const { nombre, abreviatura } = req.body;
        if (!nombre)
            return res.status(400).json({ ok: false, msg: 'nombre requerido' });
      
        const nuevoTipoDocumento =
            await TipoDocumentoModel.create(nombre, abreviatura);

        return res.status(201).json({
            ok: true,
            data: nuevoTipoDocumento
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el tipo documento'
        });
    }
};

const update = async (req, res) =>{
    try {
        const { id } = req.params;
        const { nombre, abreviatura } = req.body

        if (!nombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre es obligatorio'
            });
        };

        const updateTipoDocumento = await TipoDocumentoModel.update(id, nombre, abreviatura);

        if (!updateTipoDocumento) {
            return res.status(404).json({
                ok: false,
                msg: 'tipo documento no encontrada'
            });
        };

        return res.status(200).json({
            ok: true,
            data: updateTipoDocumento
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al editar tipo documento'
        });
    }
};

const remove = async (req, res) => {
    try {
        const resultado =
            await TipoDocumentoModel.remove(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                ok: false,
                msg: 'Tipo Documento no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Tipo Documento eliminada correctamente'
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la Tipo Documento'
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