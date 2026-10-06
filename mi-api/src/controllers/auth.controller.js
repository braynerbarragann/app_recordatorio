const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuario.model');
require('dotenv').config();

const faltanCampos = (body, camposRequeridos) => {
    return camposRequeridos.some(campo =>
        !Object.prototype.hasOwnProperty.call(body, campo)
    );
};

const create = async (req, res) => {
    try {
        const { nombre, correo, telefono, contrasena } = req.body;

        const camposRequeridos = ['nombre', 'correo', 'contrasena'];
        const faltaCampo = faltanCampos(req.body, camposRequeridos);

        if (faltaCampo || !nombre || !correo || !contrasena)
            return res.status(400).json({ ok: false, msg: 'nombre, correo y contraseña requeridos' });

        const usuarioExistente = await UsuarioModel.getByMail(correo);

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: 'El correo ya está registrado'
            });
        }
        const contrasenaHash = await bcrypt.hash(contrasena, 10);

        const data = await UsuarioModel.create(nombre, correo, telefono, contrasenaHash);

        return res.status(201).json({ ok: true, data });

    } catch (err) {
        res.status(500).json({ ok: false, msg: err.message });
    }
};


const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({
                mensaje: 'Correo y contraseña son obligatorios'
            });
        }

        const usuario = await UsuarioModel.getByMail(correo);

        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const contrasenaValida = await bcrypt.compare(
            contrasena,
            usuario.contrasena_hash
        );

        if (!contrasenaValida) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const token = jwt.sign(
            {
                usuario_id: usuario.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id: usuario.id,
                token,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

module.exports = {
    login, create
};