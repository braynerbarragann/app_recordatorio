const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controller');
const pacientesCtrl = require('../controllers/pacientes.controller')
const tratamientosCtrl = require('../controllers/tratamientos.controller');
const tratamientos_medCtrl = require('../controllers/tratamientos_medicamentos.controller');
const citasCtrl =  require('../controllers/citas.controller');
const tomasCtrl = require('../controllers/tomas_medicamentos.controller');


router.get('/', pacientesCtrl.getAll);
router.get('/:id', pacientesCtrl.getById);
router.post('/', pacientesCtrl.create);

router.get('/:usuarioId/tratamientos', tratamientosCtrl.getAllByUsuarioId);
router.get('/:usuarioId/tratamientos/:id', tratamientosCtrl.getById);
router.post('/:usuarioId/tratamientos/', tratamientosCtrl.create);

router.get('/:usuarioId/tratamientos/:tratamientoId/medicamentos', tratamientos_medCtrl.getAll);
router.get('/:usuarioId/tratamientos/:tratamientoId/medicamentos/:traMedicaID', tratamientos_medCtrl.getById);

router.get('/:usuarioId/tratamientos/:tratamientoId/medicamentos/:traMedicaID/tomas', tomasCtrl.getAll);
router.get('/:usuarioId/tratamientos/:tratamientoId/medicamentos/:traMedicaID/tomas/:tomaId', tomasCtrl.getById);

router.get('/:usuarioId/citas', citasCtrl.getAllByUsuarioId);
router.get('/:usuarioId/citas/:id', citasCtrl.getById);
router.post('/:usuarioId/citas/', citasCtrl.create);


module.exports = router;