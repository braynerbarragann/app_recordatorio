const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controller');
const tratamientosCtrl = require('../controllers/tratamientos.controller');
const tratamientos_medCtrl = require('../controllers/tratamientos_medicamentos.controller');
const citasCtrl =  require('../controllers/citas.controller');
const tomasCtrl = require('../controllers/tomas_medicamentos.controller');


router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);

router.get('/:usuarioId/tratamientos', tratamientosCtrl.getAll);
router.get('/:usuarioId/tratamientos/:id', tratamientosCtrl.getById);

router.get('/:usuarioId/tratamientos/:tratamientoId/medicamentos', tratamientos_medCtrl.getAll);
router.get('/:usuarioId/tratamientos/:tratamientoId/medicamentos/:traMedicaID', tratamientos_medCtrl.getById);

router.get('/:usuarioId/tratamientos/:tratamientoId/medicamentos/:traMedicaID/tomas', tomasCtrl.getAll);
router.get('/:usuarioId/tratamientos/:tratamientoId/medicamentos/:traMedicaID/tomas/:tomaId', tomasCtrl.getById);

router.get('/:usuarioId/citas', citasCtrl.getAll);
router.get('/:usuarioId/citas/:id', citasCtrl.getById);


module.exports = router;