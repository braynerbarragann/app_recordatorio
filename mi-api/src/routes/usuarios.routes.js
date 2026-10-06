const express = require('express');
const router = express.Router();
const ctrlUsuario = require('../controllers/usuarios.controller');
const ctrlUsuarioPaciente = require('../controllers/usuario_pacientes.controller');
const { verificarToken } = require('../middlewares/auth.middleware');



router.get('/', ctrlUsuario.getAll);
router.get('/me', verificarToken, ctrlUsuario.getById);

router.put('/:id', ctrlUsuario.update);
router.delete('/:id', ctrlUsuario.remove);

router.get('/:usuarioId/pacientes', verificarToken, ctrlUsuarioPaciente.getAllByUsuarioId);
router.get('/:usuarioId/pacientes/:pacienteId', ctrlUsuarioPaciente.getById);
router.post('/:usuarioId/pacientes', ctrlUsuarioPaciente.create);
router.put('/:usuarioId/pacientes/:pacienteId', ctrlUsuarioPaciente.update);
router.delete('/:usuarioId/pacientes/:pacienteId', ctrlUsuarioPaciente.remove);




module.exports = router;
