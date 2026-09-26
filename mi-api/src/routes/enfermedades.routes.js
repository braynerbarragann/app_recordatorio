const express = require('express');
const router = express.Router();
const enfermedadesCtrl = require('../controllers/enfermedades.controller')


router.get('/', enfermedadesCtrl.getAll);
router.get('/:id', enfermedadesCtrl.getById);
router.post('/', enfermedadesCtrl.create);
router.put('/:id', enfermedadesCtrl.update);
router.delete('/:id', enfermedadesCtrl.remove);

module.exports = router;