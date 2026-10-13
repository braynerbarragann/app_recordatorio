const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const rutasDisponibles = [
  'AUTH - Públicas',
  'POST   /api/auth/login',
  'POST   /api/auth/create',
  '',
  'USUARIOS - Protegidas',
  'GET    /api/usuarios/me',
  'PUT    /api/usuarios/me',
  'DELETE /api/usuarios/me',
  'GET    /api/usuarios/me/pacientes',
  'POST   /api/usuarios/me/pacientes',
  'GET    /api/usuarios/me/pacientes/:pacienteId',
  'PUT    /api/usuarios/me/pacientes/:pacienteId',
  'DELETE /api/usuarios/me/pacientes/:pacienteId',
  '',
  'PACIENTES - Protegidas',
  'GET    /api/pacientes/:id',
  'POST   /api/pacientes',
  'PUT    /api/pacientes/:id',
  'GET, POST /api/pacientes/:pacienteId/citas',
  'GET, PUT, DELETE /api/pacientes/:pacienteId/citas/:id',
  'GET, POST /api/pacientes/:pacienteId/diagnosticos',
  'GET, PUT, DELETE /api/pacientes/:pacienteId/diagnosticos/:id',
  'GET, POST /api/pacientes/:pacienteId/tratamientos',
  'GET, PUT, DELETE /api/pacientes/:pacienteId/tratamientos/:id',
  'GET, POST /api/pacientes/:pacienteId/tratamientos/:tratamientoId/medicamentos',
  'GET, PUT, DELETE /api/pacientes/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId',
  'GET, POST /api/pacientes/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas',
  'GET, PUT, DELETE /api/pacientes/:pacienteId/tratamientos/:tratamientoId/medicamentos/:tratamientoMedicamentoId/tomas/:tomaId',
  '',
  'CATÁLOGOS',
  'GET /api/tipos-documento y GET /api/tipos-documento/:id - Públicos',
  'GET /api/generos y GET /api/generos/:id - Públicos',
  'POST, PUT, DELETE en tipos-documento y géneros - Protegidas',
  'GET, POST, PUT, DELETE /api/vias-administracion[/:id] - Protegidas',
  'GET, POST, PUT, DELETE /api/tipos-relacion[/:id] - Protegidas',
  'GET, POST, PUT, DELETE /api/tipos-enfermedad[/:id] - Protegidas',
  'GET, POST, PUT, DELETE /api/tipos-frecuencia[/:id] - Protegidas',
  'GET, POST, PUT, DELETE /api/dias-semana[/:id] - Protegidas',
  'GET, POST, PUT, DELETE /api/tipos-cita[/:id] - Protegidas',
  'GET, POST, PUT, DELETE /api/medicamentos[/:id] - Protegidas',
  'GET, POST, PUT, DELETE /api/enfermedades[/:id] - Protegidas'
];

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 API iniciada en http://localhost:${PORT}/api`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'no definido'}`);
  console.log('=================================');
  console.log('Rutas disponibles (los endpoints protegidos requieren Bearer token):');
  rutasDisponibles.forEach((ruta) => console.log(ruta));
  console.log('=================================');
});
