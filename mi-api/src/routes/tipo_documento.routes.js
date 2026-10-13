const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tipo_documento.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', verificarToken, ctrl.create);
router.put('/:id', verificarToken, ctrl.update)
router.delete('/:id', verificarToken, ctrl.remove)

module.exports = router;
