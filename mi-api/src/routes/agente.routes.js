const express = require('express');
const router = express.Router();
const agenteCtrl = require('../controllers/agente.controller');

router.post('/intencion', agenteCtrl.predecirIntencion);

module.exports = router;