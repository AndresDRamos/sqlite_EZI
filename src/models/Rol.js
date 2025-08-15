// src/models/Rol.js - Modelo de Rol (ES Modules)
import database from '../../config/database.js';

class Rol {
  constructor(data = {}) {
    this.idRol = data.idRol;
    this.NombreRol = data.NombreRol;
  }

  // Obtener todos los roles
  static async findAll() {
    try {
      const sql = `
        SELECT idRol, NombreRol 
        FROM Roles 
        ORDER BY idRol
      `;
      const rows = await database.query(sql);
      return rows.map(row => new Rol(row));
    } catch (error) {
      throw new Error(`Error obteniendo roles: ${error.message}`);
    }
  }

  // Obtener rol por ID
  static async findById(id) {
    try {
      const sql = `
        SELECT idRol, NombreRol 
        FROM Roles 
        WHERE idRol = ?
      `;
      const rows = await database.query(sql, [id]);
      return rows.length > 0 ? new Rol(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error obteniendo rol: ${error.message}`);
    }
  }

  // Crear nuevo rol
  async save() {
    try {
      const sql = `
        INSERT INTO Roles (NombreRol) 
        VALUES (?)
      `;
      const result = await database.query(sql, [this.NombreRol]);
      this.idRol = result.lastID;
      return this;
    } catch (error) {
      throw new Error(`Error creando rol: ${error.message}`);
    }
  }

  // Actualizar rol
  async update() {
    try {
      const sql = `
        UPDATE Roles 
        SET NombreRol = ?
        WHERE idRol = ?
      `;
      await database.query(sql, [this.NombreRol, this.idRol]);
      return this;
    } catch (error) {
      throw new Error(`Error actualizando rol: ${error.message}`);
    }
  }

  // Eliminar rol
  async delete() {
    try {
      const sql = `DELETE FROM Roles WHERE idRol = ?`;
      await database.query(sql, [this.idRol]);
      return true;
    } catch (error) {
      throw new Error(`Error eliminando rol: ${error.message}`);
    }
  }
}

export default Rol;
