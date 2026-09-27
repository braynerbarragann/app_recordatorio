const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
//const tiposDocumentoRouter = require('./routes/tipos_documento.routes');
//app.use('/api/tipos-documento', tiposDocumentoRouter);

const usuariosRouter = require('./routes/usuarios.routes');
app.use('/api/usuarios', usuariosRouter);

const pacientesRouter = require('./routes/pacientes.routes');
app.use('/api/pacientes', pacientesRouter);

const medicamentoRouter = require('./routes/medicamento.routes');
app.use('/api/medicamento', medicamentoRouter);

const via_administracionRouter = require('./routes/via_administracion.routes');
app.use('/api/via-administracion', via_administracionRouter);

const tipo_documentoRouter = require('./routes/tipo_documento.routes');
app.use('/api/tipo-documento', tipo_documentoRouter);

const generoRouter = require('./routes/genero.routes');
app.use('/api/genero', generoRouter);

const tipo_relacionRouter = require('./routes/tipo_relacion.routes');
app.use('/api/tipo-relacion', tipo_relacionRouter);

const tipo_enfermedadRouter = require('./routes/tipo_enfermedad.routes');
app.use('/api/tipo-enfermedad', tipo_enfermedadRouter);

const tipo_frecuenciaRouter = require('./routes/tipo_frecuencia.routes');
app.use('/api/tipo-frecuencia', tipo_frecuenciaRouter);

const dia_semanaRouter = require('./routes/dia_semana.routes');
app.use('/api/dia-semana', dia_semanaRouter);

const tipo_citaRouter = require('./routes/tipo_cita.routes');
app.use('/api/tipo-cita/', tipo_citaRouter);

module.exports = app;
