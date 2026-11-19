const fs = require('fs');
const path = require('path');

const mysql = require('mysql2/promise');
require('dotenv').config();

// createPool: reutiliza conexiones automáticamente
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_POOL_LIMIT || 10,
  waitForConnections: true,
  ssl: {
  ca: fs.readFileSync(
    path.resolve(__dirname, '../../certs/DigiCertGlobalRootG2.crt.pem'),
    'utf8'
  ),
  rejectUnauthorized: true,
  },
});


const appInsights = require('applicationinsights');

const queryOriginal = pool.query.bind(pool);

const registrarDependenciaMySQL = (duracion, exito, codigoResultado) => {
  const cliente = appInsights.defaultClient;

  // La telemetría no debe impedir que la consulta normal funcione.
  if (!cliente) return;

  cliente.trackDependency({
    target: process.env.DB_HOST || 'MySQL',
    name: 'MySQL query',
    data: 'mysql2/promise pool.query',
    duration: duracion,
    resultCode: codigoResultado,
    success: exito,
    dependencyTypeName: 'SQL'
  });
};

pool.query = (...argumentos) => {
  const inicio = Date.now();
  let consulta;

  try {
    consulta = queryOriginal(...argumentos);
  } catch (error) {
    registrarDependenciaMySQL(
      Date.now() - inicio,
      false,
      error.code || 'ERROR'
    );
    throw error;
  }

  // Las llamadas de los modelos usan la versión Promise de mysql2.
  // Si algún código usa callback, se devuelve sin envolver.
  if (!consulta || typeof consulta.then !== 'function') {
    return consulta;
  }

  return consulta.then(
    (resultado) => {
      registrarDependenciaMySQL(Date.now() - inicio, true, 0);
      return resultado;
    },
    (error) => {
      registrarDependenciaMySQL(
        Date.now() - inicio,
        false,
        error.code || 'ERROR'
      );
      throw error;
    }
  );
};


// Verificar conexión al iniciar
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL conectado');
    conn.release(); // devolver al pool
  })
  .catch(err => {
    console.error('❌ Error MySQL:', err.message);
    process.exit(1); // detener app si no hay DB
  });

module.exports = pool;