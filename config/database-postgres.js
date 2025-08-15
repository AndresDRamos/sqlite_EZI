// config/database-postgres.js - Configuración para PostgreSQL
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

class PostgresDatabase {
  constructor() {
    this.pool = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      // Configuración para Railway PostgreSQL
      const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
      
      if (!connectionString) {
        reject(new Error('DATABASE_URL o POSTGRES_URL no está configurada'));
        return;
      }

      this.pool = new Pool({
        connectionString: connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });

      this.pool.connect((err, client, release) => {
        if (err) {
          console.error('Error conectando a PostgreSQL:', err);
          reject(err);
        } else {
          console.log('✅ Conectado a PostgreSQL');
          release();
          resolve();
        }
      });
    });
  }

  async query(sql, params = []) {
    try {
      const result = await this.pool.query(sql, params);
      
      // Para compatibilidad con SQLite, ajustamos la respuesta
      if (sql.trim().toLowerCase().startsWith('select')) {
        return result.rows;
      } else {
        return {
          lastID: result.rows.length > 0 ? result.rows[0].id : null,
          changes: result.rowCount || 0
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('🔐 Conexión PostgreSQL cerrada');
    }
  }
}

export default new PostgresDatabase();
