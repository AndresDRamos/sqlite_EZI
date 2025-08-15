// src/models/FolioResponsable.js - Modelo de Folio_responsables (ES Modules)
import database from '../../config/database.js';

class FolioResponsable {
  constructor(data = {}) {
    this.id = data.id;
    this.idFolio = data.idFolio;
    this.idUsuario = data.idUsuario;
    this.FechaAsignacion = data.FechaAsignacion;
  }

  // Obtener todos los responsables
  static async findAll() {
    try {
      const sql = `
        SELECT fr.*, u.Nombre as NombreUsuario, f.Nombre as NombreFolio
        FROM Folio_responsables fr
        INNER JOIN Usuarios u ON fr.idUsuario = u.idUsuario
        INNER JOIN Folios f ON fr.idFolio = f.idFolio
        ORDER BY fr.FechaAsignacion DESC
      `;
      const rows = await database.query(sql);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo responsables: ${error.message}`);
    }
  }

  // Obtener responsables por folio
  static async findByFolio(idFolio) {
    try {
      const sql = `
        SELECT fr.*, u.Nombre as NombreUsuario, u.Correo
        FROM Folio_responsables fr
        INNER JOIN Usuarios u ON fr.idUsuario = u.idUsuario
        WHERE fr.idFolio = ?
        ORDER BY fr.FechaAsignacion
      `;
      const rows = await database.query(sql, [idFolio]);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo responsables del folio: ${error.message}`);
    }
  }

  // Obtener folios asignados a un usuario
  static async findByUsuario(idUsuario) {
    try {
      const sql = `
        SELECT fr.*, f.Nombre as NombreFolio, f.Prioridad, f.TipoSolicitud
        FROM Folio_responsables fr
        INNER JOIN Folios f ON fr.idFolio = f.idFolio
        WHERE fr.idUsuario = ?
        ORDER BY fr.FechaAsignacion DESC
      `;
      const rows = await database.query(sql, [idUsuario]);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo folios del usuario: ${error.message}`);
    }
  }

  // Asignar responsable a folio
  async save() {
    try {
      const sql = `
        INSERT INTO Folio_responsables (idFolio, idUsuario) 
        VALUES (?, ?)
      `;
      const result = await database.query(sql, [this.idFolio, this.idUsuario]);
      this.id = result.lastID;
      return this;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('El usuario ya está asignado a este folio');
      }
      throw new Error(`Error asignando responsable: ${error.message}`);
    }
  }

  // Remover responsable de folio
  static async removeResponsable(idFolio, idUsuario) {
    try {
      const sql = `
        DELETE FROM Folio_responsables 
        WHERE idFolio = ? AND idUsuario = ?
      `;
      const result = await database.query(sql, [idFolio, idUsuario]);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Error removiendo responsable: ${error.message}`);
    }
  }

  // Verificar si un usuario es responsable de un folio
  static async isResponsable(idFolio, idUsuario) {
    try {
      const sql = `
        SELECT id 
        FROM Folio_responsables 
        WHERE idFolio = ? AND idUsuario = ?
      `;
      const rows = await database.query(sql, [idFolio, idUsuario]);
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error verificando responsable: ${error.message}`);
    }
  }

  // Obtener estadísticas de asignaciones
  static async getEstadisticas() {
    try {
      const sql = `
        SELECT 
          u.Nombre as NombreUsuario,
          COUNT(fr.id) as TotalAsignaciones,
          COUNT(CASE WHEN f.Prioridad = 'Alta' THEN 1 END) as FoliosAlta,
          COUNT(CASE WHEN f.Prioridad = 'Media' THEN 1 END) as FoliosMedia,
          COUNT(CASE WHEN f.Prioridad = 'Baja' THEN 1 END) as FoliosBaja
        FROM Usuarios u
        LEFT JOIN Folio_responsables fr ON u.idUsuario = fr.idUsuario
        LEFT JOIN Folios f ON fr.idFolio = f.idFolio
        GROUP BY u.idUsuario, u.Nombre
        ORDER BY TotalAsignaciones DESC
      `;
      const rows = await database.query(sql);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  }
}

export default FolioResponsable;
