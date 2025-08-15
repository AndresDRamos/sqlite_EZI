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
      // Convertir sintaxis SQLite (?) a PostgreSQL ($1, $2, etc.)
      let pgSql = sql;
      if (params.length > 0) {
        let paramIndex = 1;
        pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
      }
      
      console.log('🔍 Ejecutando query:', pgSql.substring(0, 100) + '...');
      console.log('📊 Parámetros:', params);
      
      const result = await this.pool.query(pgSql, params);
      
      console.log('✅ Resultado:', result.rowCount, 'filas afectadas');
      
      // Para compatibilidad con SQLite, ajustamos la respuesta
      if (pgSql.trim().toLowerCase().startsWith('select')) {
        return result.rows;
      } else {
        // Para INSERT, intentar obtener el ID insertado
        let lastID = null;
        if (pgSql.trim().toLowerCase().startsWith('insert') && result.rows.length > 0) {
          // Si la query retorna el ID (RETURNING clause)
          lastID = result.rows[0].id || result.rows[0].idUsuario || result.rows[0].idFolio || result.rows[0].idRol;
        }
        
        return {
          lastID: lastID,
          changes: result.rowCount || 0
        };
      }
    } catch (error) {
      console.error('❌ Error en query PostgreSQL:', error.message);
      console.error('❌ SQL:', sql);
      console.error('❌ Parámetros:', params);
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
