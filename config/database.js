// config/database.js - Configuración de base de datos (ES Modules)
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const sqlite = sqlite3.verbose();
      this.db = new sqlite.Database(
        join(__dirname, '../database/ventanilla.db'),
        (err) => {
          if (err) {
            console.error('Error conectando a la base de datos:', err);
            reject(err);
          } else {
            console.log('✅ Conectado a SQLite');
            resolve();
          }
        }
      );
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (sql.trim().toLowerCase().startsWith('select')) {
        this.db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      } else {
        this.db.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      }
    });
  }

  close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) console.error('Error cerrando DB:', err);
          else console.log('🔐 Base de datos cerrada');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

export default new Database();
