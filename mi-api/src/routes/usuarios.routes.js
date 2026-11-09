const express = require('express');
const router = express.Router();
const ctrlUsuario = require('../controllers/usuarios.controller');
const ctrlUsuarioPaciente = require('../controllers/usuario_pacientes.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

//router.get('/', ctrlUsuario.getAll);
router.get('/me', verificarToken, ctrlUsuario.getById);
<<<<<<< HEAD
<<<<<<< HEAD
router.put('/', verificarToken, ctrlUsuario.update);
router.delete('/', verificarToken, ctrlUsuario.remove);
=======
router.put('/me', verificarToken, ctrlUsuario.update);
router.delete('/me', verificarToken, ctrlUsuario.remove);
>>>>>>> 75887e0edb04c799ec909fb69d2d1b65726d5e31
=======
router.put('/', verificarToken, ctrlUsuario.update);
router.delete('/', verificarToken, ctrlUsuario.remove);
>>>>>>> 303ea9b3c54bc90ddd77809cd98dd81b5c1eb00d

// Obtener todos los pacientes del usuario autenticado
router.get('/me/pacientes', verificarToken, ctrlUsuarioPaciente.getAllByUsuarioId);
router.post('/me/pacientes', verificarToken, ctrlUsuarioPaciente.create);
router.get('/me/pacientes/:pacienteId', verificarToken, ctrlUsuarioPaciente.getById);
router.put('/me/pacientes/:pacienteId', verificarToken, ctrlUsuarioPaciente.update);
router.delete('/me/pacientes/:pacienteId', verificarToken, ctrlUsuarioPaciente.remove);

module.exports = router;