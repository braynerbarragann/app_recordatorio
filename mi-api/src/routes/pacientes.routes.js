const express = require('express');
const router = express.Router();
const pacientesCtrl = require('../controllers/pacientes.controller')
const tratamientosCtrl = require('../controllers/tratamientos.controller');
const tratamientos_medCtrl = require('../controllers/tratamientos_medicamentos.controller');
const citasCtrl =  require('../controllers/citas.controller');
const diagnosticosCtrl = require('../controllers/diagnosticos.controller');
const tomasCtrl = require('../controllers/tomas_medicamentos.controller');


router.get('/', pacientesCtrl.getAll);
router.get('/:id', pacientesCtrl.getById);
router.post('/', pacientesCtrl.create);
router.put('/:id', pacientesCtrl.update);
router.delete('/:id', pacientesCtrl.remove);

router.get('/:pacienteId/citas', citasCtrl.getAllByPacienteId);
router.get('/:pacienteId/citas/:id', citasCtrl.getById);
router.post('/:pacienteId/citas', citasCtrl.create);
router.put('/:pacienteId/citas/:id', citasCtrl.update);
router.delete('/:pacienteId/citas/:id', citasCtrl.remove);

router.get('/:pacienteId/diagnosticos', diagnosticosCtrl.getAllByPacienteId);
router.get('/:pacienteId/diagnosticos/:id', diagnosticosCtrl.getById);
router.post('/:pacienteId/diagnosticos', diagnosticosCtrl.create);
router.put('/:pacienteId/diagnosticos/:id', diagnosticosCtrl.update);
router.delete('/:pacienteId/diagnosticos/:id', diagnosticosCtrl.remove);

router.get('/:pacienteId/tratamientos', tratamientosCtrl.getAllByPacienteId);
router.get('/:pacienteId/tratamientos/:id', tratamientosCtrl.getById);
router.post('/:pacienteId/tratamientos', tratamientosCtrl.create);
router.put('/:pacienteId/tratamientos/:id', tratamientosCtrl.update);
router.delete('/:pacienteId/tratamientos/:id', tratamientosCtrl.remove);

router.get(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos',
    tratamientos_medCtrl.getAll
);
router.get(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId',
    tratamientos_medCtrl.getById
);
router.post(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos',
    tratamientos_medCtrl.create
);
router.put(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId',
    tratamientos_medCtrl.update
);
router.delete(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId',
    tratamientos_medCtrl.remove
);



router.get(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas',
    tomasCtrl.getAll
);
router.get(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas/:tomaId',
    tomasCtrl.getById
);
router.post(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas',
    tomasCtrl.create
);
router.put(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas/:tomaId',
    tomasCtrl.update
);
router.delete(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas/:tomaId',
    tomasCtrl.remove
);








module.exports = router;
