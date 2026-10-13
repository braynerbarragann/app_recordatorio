const express = require('express');
const router = express.Router();
const ctrlUsuario = require('../controllers/usuarios.controller');
const ctrlUsuarioPaciente = require('../controllers/usuario_pacientes.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', ctrlUsuario.getAll);
router.get('/me', verificarToken, ctrlUsuario.getById);
router.put('/', verificarToken, ctrlUsuario.update);
router.delete('/', verificarToken, ctrlUsuario.remove);

// Obtener todos los pacientes del usuario autenticado
router.get('/me/pacientes', verificarToken, ctrlUsuarioPaciente.getAllByUsuarioId);
router.post('/me/pacientes', verificarToken, ctrlUsuarioPaciente.create);
router.get('/:usuarioId/pacientes/:pacienteId', verificarToken, ctrlUsuarioPaciente.getById);
router.put('/:usuarioId/pacientes/:pacienteId', verificarToken, ctrlUsuarioPaciente.update);
router.delete('/:usuarioId/pacientes/:pacienteId', verificarToken, ctrlUsuarioPaciente.remove);

module.exports = router;