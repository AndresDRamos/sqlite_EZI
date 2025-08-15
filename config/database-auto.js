// config/database-auto.js - Configuración automática de base de datos
import sqlite3Database from './database.js';
import postgresDatabase from './database-postgres.js';

// Detectar automáticamente qué base de datos usar
const isDevelopment = process.env.NODE_ENV !== 'production';
const hasPostgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// Usar PostgreSQL en producción si está disponible, SQLite en desarrollo
const database = (isDevelopment && !hasPostgresUrl) ? sqlite3Database : postgresDatabase;

console.log(`🔧 Usando base de datos: ${isDevelopment && !hasPostgresUrl ? 'SQLite (Desarrollo)' : 'PostgreSQL (Producción)'}`);

export default database;
