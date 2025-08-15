// cleanup-only.js - Script temporal para limpiar base de datos
import { config } from 'dotenv';
import cleanupPostgresTables from './database/cleanup-postgres.js';

config(); // Cargar variables de entorno

async function runCleanup() {
  try {
    console.log('🚀 Iniciando limpieza de base de datos PostgreSQL...\n');
    
    await cleanupPostgresTables();
    
    console.log('\n✨ ¡Limpieza completada!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    process.exit(1);
  }
}

runCleanup();
