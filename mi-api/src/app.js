const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
const ususariosRouter = require('./routes/usuarios.routes');
app.use('/api/usuarios', ususariosRouter);

module.exports = app;