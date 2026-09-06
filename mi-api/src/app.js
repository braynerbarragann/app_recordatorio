const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
const usuariosRouter = require('./routes/usuarios.routes');
app.use('/api/usuarios', usuariosRouter);

const medicamentosRouter = require('./routes/medicamentos.routes');
app.use('/api/medicamentos', medicamentosRouter);

const via_administracionRouter = require('./routes/via_administracion.routes');
app.use('/api/via_administracion', via_administracionRouter);

module.exports = app;