// database/auto-migrate.js - Migración automática según el entorno
import database from '../config/database-auto.js';
import migratePostgres from './migrate-postgres.js';
import createTablesSQLite from './create-tables-direct.js';

async function autoMigrate() {
  try {
    console.log('🚀 Iniciando migración automática...');
    
    // Detectar qué tipo de base de datos estamos usando
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const hasPostgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (isDevelopment && !hasPostgresUrl) {
      console.log('📝 Ejecutando migración SQLite...');
      await createTablesSQLite();
    } else {
      console.log('🐘 Ejecutando migración PostgreSQL...');
      await migratePostgres();
    }
    
    console.log('✅ Migración automática completada');
    
  } catch (error) {
    console.error('❌ Error en migración automática:', error);
    process.exit(1);
  }
}

// Solo ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  autoMigrate();
}

export default autoMigrate;
