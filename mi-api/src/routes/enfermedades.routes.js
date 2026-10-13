const express = require('express');
const router = express.Router();
const enfermedadesCtrl = require('../controllers/enfermedades.controller')
const { verificarToken } = require('../middlewares/auth.middleware');

router.use(verificarToken);

router.get('/', enfermedadesCtrl.getAll);
router.get('/:id', enfermedadesCtrl.getById);
router.post('/', enfermedadesCtrl.create);
router.put('/:id', enfermedadesCtrl.update);
router.delete('/:id', enfermedadesCtrl.remove);

module.exports = router;
