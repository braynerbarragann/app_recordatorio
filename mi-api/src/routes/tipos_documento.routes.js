const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tipos_documento.controller');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);

module.exports = router;