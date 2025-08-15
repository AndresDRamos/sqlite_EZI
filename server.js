// server.js - Punto de entrada principal con PostgreSQL (ES Modules)
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Importaciones
import database from './config/database.js';
import apiRoutes from './src/routes/index.js';
import errorHandler from './src/middleware/errorHandler.js';
import createPostgresTables from './database/migrate-postgres.js';

config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', apiRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Ventanilla CH API - MVC Architecture',
    version: '2.0.0',
    status: 'running',
    architecture: 'MVC',
    endpoints: '/api'
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Conectar a la base de datos PostgreSQL
    await database.connect();
    
    // Ejecutar migraciones automáticamente
    console.log('🔄 Ejecutando migración de base de datos...');
    await createPostgresTables();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor iniciado');
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🏗️  Arquitectura: MVC + PostgreSQL`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando servidor...');
  await database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Cerrando servidor...');
  await database.close();
  process.exit(0);
});

startServer();
