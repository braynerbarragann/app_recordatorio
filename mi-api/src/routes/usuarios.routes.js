const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controller');
const tratamientosctrl = require('../controllers/tratamientos.controller');
const citasctrl = require('../controllers/citas.controller');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);

router.get('/:usuarioId/tratamientos', tratamientosctrl.getAll);
router.get('/:usuarioId/tratamientos/:id', tratamientosctrl.getById);

router.get('/:usuarioId/citas', citasctrl.getAll);
router.get('/:usuarioId/citas/:id', citasctrl.getById);


module.exports = router;