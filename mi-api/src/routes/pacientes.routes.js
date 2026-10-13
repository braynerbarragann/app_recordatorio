const express = require('express');
const router = express.Router();
const pacientesCtrl = require('../controllers/pacientes.controller')
const tratamientosCtrl = require('../controllers/tratamientos.controller');
const tratamientos_medCtrl = require('../controllers/tratamientos_medicamentos.controller');
const citasCtrl =  require('../controllers/citas.controller');
const diagnosticosCtrl = require('../controllers/diagnosticos.controller');
const tomasCtrl = require('../controllers/tomas_medicamentos.controller');
const { verificarToken } = require('../middlewares/auth.middleware');



router.get('/:id', verificarToken, pacientesCtrl.getById);
router.post('/', verificarToken, pacientesCtrl.create);
router.put('/:id', verificarToken, pacientesCtrl.update);

router.get('/:pacienteId/citas', verificarToken, citasCtrl.getAllByPacienteId);
router.get('/:pacienteId/citas/:id', verificarToken, citasCtrl.getById);
router.post('/:pacienteId/citas', verificarToken, citasCtrl.create);
router.put('/:pacienteId/citas/:id', verificarToken, citasCtrl.update);
router.delete('/:pacienteId/citas/:id', verificarToken, citasCtrl.remove);

router.get('/:pacienteId/diagnosticos', verificarToken, diagnosticosCtrl.getAllByPacienteId);
router.get('/:pacienteId/diagnosticos/:id', verificarToken, diagnosticosCtrl.getById);
router.post('/:pacienteId/diagnosticos', verificarToken, diagnosticosCtrl.create);
router.put('/:pacienteId/diagnosticos/:id', verificarToken, diagnosticosCtrl.update);
router.delete('/:pacienteId/diagnosticos/:id', verificarToken, diagnosticosCtrl.remove);

router.get('/:pacienteId/tratamientos', verificarToken, tratamientosCtrl.getAllByPacienteId);
router.get('/:pacienteId/tratamientos/:id', verificarToken, tratamientosCtrl.getById);
router.post('/:pacienteId/tratamientos', verificarToken, tratamientosCtrl.create);
router.put('/:pacienteId/tratamientos/:id', verificarToken, tratamientosCtrl.update);
router.delete('/:pacienteId/tratamientos/:id', verificarToken, tratamientosCtrl.remove);

router.get(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos',
    verificarToken,
    tratamientos_medCtrl.getAll
);
router.get(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId',
    verificarToken,
    tratamientos_medCtrl.getById
);
router.post(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos',
    verificarToken,
    tratamientos_medCtrl.create
);
router.put(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId',
    verificarToken,
    tratamientos_medCtrl.update
);
router.delete(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId',
    verificarToken,
    tratamientos_medCtrl.remove
);



router.get(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas',
    verificarToken,
    tomasCtrl.getAll
);
router.get(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas/:tomaId',
    verificarToken,
    tomasCtrl.getById
);
router.post(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas',
    verificarToken,
    tomasCtrl.create
);
router.put(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas/:tomaId',
    verificarToken,
    tomasCtrl.update
);
router.delete(
    '/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas/:tomaId',
    verificarToken,
    tomasCtrl.remove
);








module.exports = router;
