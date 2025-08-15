// database.js - Configuración de conexión a la base de datos
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
const path = require('path');

class Database {
  constructor() {
    // Usar SQLite si no hay DATABASE_URL configurada o si DB_TYPE está configurado como sqlite
    this.isProduction = process.env.NODE_ENV === 'production' && 
                       process.env.DATABASE_URL && 
                       process.env.DB_TYPE !== 'sqlite';
    this.connection = null;
  }

  // Conectar a la base de datos
  async connect() {
    if (this.isProduction) {
      // PostgreSQL para producción
      this.connection = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
      await this.connection.connect();
      console.log('Conectado a PostgreSQL');
    } else {
      // SQLite para desarrollo
      return new Promise((resolve, reject) => {
        this.connection = new sqlite3.Database(path.join(__dirname, 'ventanilla.db'), (err) => {
          if (err) {
            console.error('Error conectando a SQLite:', err);
            reject(err);
          } else {
            console.log('Conectado a SQLite');
            resolve();
          }
        });
      });
    }
  }

  // Ejecutar consultas
  async query(sql, params = []) {
    if (this.isProduction) {
      // PostgreSQL
      const result = await this.connection.query(sql, params);
      return result.rows;
    } else {
      // SQLite
      return new Promise((resolve, reject) => {
        if (sql.trim().toLowerCase().startsWith('select')) {
          this.connection.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        } else {
          this.connection.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
          });
        }
      });
    }
  }

  // Cerrar conexión
  async close() {
    if (this.connection) {
      if (this.isProduction) {
        await this.connection.end();
      } else {
        this.connection.close();
      }
    }
  }
}

module.exports = Database;
