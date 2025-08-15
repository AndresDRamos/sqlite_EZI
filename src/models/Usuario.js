// src/models/Usuario.js - Modelo de Usuario (ES Modules)
import database from '../../config/database-auto.js';

class Usuario {
  constructor(data = {}) {
    this.idUsuario = data.idUsuario;
    this.Nombre = data.Nombre;
    this.Usuario = data.Usuario;
    this.Correo = data.Correo;
    this.Contraseña = data.Contraseña;
    this.idRol = data.idRol;
    this.idPlanta = data.idPlanta;
    this.FechaCreacion = data.FechaCreacion;
  }

  // Obtener todos los usuarios
  static async findAll() {
    try {
      const sql = `
        SELECT idUsuario, Nombre, Usuario, Correo, idRol, idPlanta, FechaCreacion 
        FROM Usuarios 
        ORDER BY Nombre
      `;
      const rows = await database.query(sql);
      return rows.map(row => new Usuario(row));
    } catch (error) {
      throw new Error(`Error obteniendo usuarios: ${error.message}`);
    }
  }

  // Obtener usuario por ID
  static async findById(id) {
    try {
      const sql = `
        SELECT idUsuario, Nombre, Usuario, Correo, idRol, idPlanta, FechaCreacion 
        FROM Usuarios 
        WHERE idUsuario = ?
      `;
      const rows = await database.query(sql, [id]);
      return rows.length > 0 ? new Usuario(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error obteniendo usuario: ${error.message}`);
    }
  }

  // Obtener usuario por username
  static async findByUsername(username) {
    try {
      const sql = `
        SELECT * FROM Usuarios 
        WHERE Usuario = ?
      `;
      const rows = await database.query(sql, [username]);
      return rows.length > 0 ? new Usuario(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error obteniendo usuario por username: ${error.message}`);
    }
  }

  // Crear nuevo usuario
  async save() {
    try {
      if (this.idUsuario) {
        // Actualizar usuario existente
        const sql = `
          UPDATE Usuarios 
          SET Nombre = ?, Usuario = ?, Correo = ?, idRol = ?, idPlanta = ? 
          WHERE idUsuario = ?
        `;
        await database.query(sql, [
          this.Nombre, this.Usuario, this.Correo, 
          this.idRol, this.idPlanta, this.idUsuario
        ]);
        return this;
      } else {
        // Crear nuevo usuario
        const sql = `
          INSERT INTO Usuarios (Nombre, Usuario, Correo, Contraseña, idRol, idPlanta) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await database.query(sql, [
          this.Nombre, this.Usuario, this.Correo, 
          this.Contraseña, this.idRol, this.idPlanta
        ]);
        this.idUsuario = result.lastID;
        return this;
      }
    } catch (error) {
      throw new Error(`Error guardando usuario: ${error.message}`);
    }
  }

  // Eliminar usuario
  async delete() {
    try {
      const sql = 'DELETE FROM Usuarios WHERE idUsuario = ?';
      await database.query(sql, [this.idUsuario]);
      return true;
    } catch (error) {
      throw new Error(`Error eliminando usuario: ${error.message}`);
    }
  }

  // Validar credenciales (sin hash por simplicidad)
  static async validateCredentials(username, password) {
    try {
      const usuario = await this.findByUsername(username);
      if (usuario && usuario.Contraseña === password) {
        // No devolver la contraseña
        delete usuario.Contraseña;
        return usuario;
      }
      return null;
    } catch (error) {
      throw new Error(`Error validando credenciales: ${error.message}`);
    }
  }

  // Convertir a JSON (sin contraseña)
  toJSON() {
    const obj = { ...this };
    delete obj.Contraseña;
    return obj;
  }
}

export default Usuario;
