const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://frontend-recordatorio-abgpg6ajfubtfqct.spaincentral-01.azurewebsites.net'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});



// Rutas

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const usuariosRouter = require('./routes/usuarios.routes');
app.use('/api/usuarios', usuariosRouter);

const pacientesRouter = require('./routes/pacientes.routes');
app.use('/api/pacientes', pacientesRouter);

const medicamentosRouter = require('./routes/medicamento.routes');
app.use('/api/medicamentos', medicamentosRouter);

const enfermedadesRouter = require('./routes/enfermedades.routes');
app.use('/api/enfermedades', enfermedadesRouter);



//CATALOGOS

const via_administracionRouter = require('./routes/via_administracion.routes');
app.use('/api/vias-administracion', via_administracionRouter);

const tipo_documentoRouter = require('./routes/tipo_documento.routes');
app.use('/api/tipos-documento', tipo_documentoRouter);

const generoRouter = require('./routes/genero.routes');
app.use('/api/generos', generoRouter);

const tipo_relacionRouter = require('./routes/tipo_relacion.routes');
app.use('/api/tipos-relacion', tipo_relacionRouter);

const tipo_enfermedadRouter = require('./routes/tipo_enfermedad.routes');
app.use('/api/tipos-enfermedad', tipo_enfermedadRouter);

const tipo_frecuenciaRouter = require('./routes/tipo_frecuencia.routes');
app.use('/api/tipos-frecuencia', tipo_frecuenciaRouter);

const dia_semanaRouter = require('./routes/dia_semana.routes');
app.use('/api/dias-semana', dia_semanaRouter);

const tipo_citaRouter = require('./routes/tipo_cita.routes');
app.use('/api/tipos-cita/', tipo_citaRouter);

module.exports = app;
