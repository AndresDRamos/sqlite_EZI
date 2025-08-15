// src/models/FolioRespuesta.js - Modelo de Folio_respuestas (ES Modules)
import database from '../../config/database-auto.js';

class FolioRespuesta {
  constructor(data = {}) {
    this.idRespuesta = data.idRespuesta;
    this.idFolio = data.idFolio;
    this.Respuesta = data.Respuesta;
    this.FechaRespuesta = data.FechaRespuesta;
    this.idUsuario = data.idUsuario;
  }

  // Obtener todas las respuestas
  static async findAll() {
    try {
      const sql = `
        SELECT fr.*, u.Nombre as NombreUsuario, f.Nombre as NombreFolio
        FROM Folio_respuestas fr
        LEFT JOIN Usuarios u ON fr.idUsuario = u.idUsuario
        INNER JOIN Folios f ON fr.idFolio = f.idFolio
        ORDER BY fr.FechaRespuesta DESC
      `;
      const rows = await database.query(sql);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo respuestas: ${error.message}`);
    }
  }

  // Obtener respuesta por ID
  static async findById(id) {
    try {
      const sql = `
        SELECT fr.*, u.Nombre as NombreUsuario
        FROM Folio_respuestas fr
        LEFT JOIN Usuarios u ON fr.idUsuario = u.idUsuario
        WHERE fr.idRespuesta = ?
      `;
      const rows = await database.query(sql, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error obteniendo respuesta: ${error.message}`);
    }
  }

  // Obtener respuestas por folio
  static async findByFolio(idFolio) {
    try {
      const sql = `
        SELECT fr.*, u.Nombre as NombreUsuario
        FROM Folio_respuestas fr
        LEFT JOIN Usuarios u ON fr.idUsuario = u.idUsuario
        WHERE fr.idFolio = ?
        ORDER BY fr.FechaRespuesta
      `;
      const rows = await database.query(sql, [idFolio]);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo respuestas del folio: ${error.message}`);
    }
  }

  // Obtener respuestas por usuario
  static async findByUsuario(idUsuario) {
    try {
      const sql = `
        SELECT fr.*, f.Nombre as NombreFolio
        FROM Folio_respuestas fr
        INNER JOIN Folios f ON fr.idFolio = f.idFolio
        WHERE fr.idUsuario = ?
        ORDER BY fr.FechaRespuesta DESC
      `;
      const rows = await database.query(sql, [idUsuario]);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo respuestas del usuario: ${error.message}`);
    }
  }

  // Crear nueva respuesta
  async save() {
    try {
      const sql = `
        INSERT INTO Folio_respuestas (idFolio, Respuesta, idUsuario) 
        VALUES (?, ?, ?)
      `;
      const result = await database.query(sql, [
        this.idFolio,
        this.Respuesta,
        this.idUsuario
      ]);
      this.idRespuesta = result.lastID;
      return this;
    } catch (error) {
      throw new Error(`Error creando respuesta: ${error.message}`);
    }
  }

  // Actualizar respuesta
  async update() {
    try {
      const sql = `
        UPDATE Folio_respuestas 
        SET Respuesta = ?
        WHERE idRespuesta = ? AND idUsuario = ?
      `;
      const result = await database.query(sql, [
        this.Respuesta,
        this.idRespuesta,
        this.idUsuario
      ]);
      
      if (result.changes === 0) {
        throw new Error('No tienes permisos para actualizar esta respuesta');
      }
      
      return this;
    } catch (error) {
      throw new Error(`Error actualizando respuesta: ${error.message}`);
    }
  }

  // Eliminar respuesta
  async delete() {
    try {
      const sql = `
        DELETE FROM Folio_respuestas 
        WHERE idRespuesta = ? AND idUsuario = ?
      `;
      const result = await database.query(sql, [this.idRespuesta, this.idUsuario]);
      
      if (result.changes === 0) {
        throw new Error('No tienes permisos para eliminar esta respuesta');
      }
      
      return true;
    } catch (error) {
      throw new Error(`Error eliminando respuesta: ${error.message}`);
    }
  }

  // Obtener estadísticas de respuestas
  static async getEstadisticas() {
    try {
      const sql = `
        SELECT 
          DATE(fr.FechaRespuesta) as Fecha,
          COUNT(fr.idRespuesta) as TotalRespuestas,
          COUNT(DISTINCT fr.idFolio) as FoliosRespondidos,
          COUNT(DISTINCT fr.idUsuario) as UsuariosActivos
        FROM Folio_respuestas fr
        WHERE fr.FechaRespuesta >= date('now', '-30 days')
        GROUP BY DATE(fr.FechaRespuesta)
        ORDER BY Fecha DESC
      `;
      const rows = await database.query(sql);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  }

  // Obtener últimas respuestas por folio
  static async getUltimasRespuestasPorFolio() {
    try {
      const sql = `
        WITH UltimasRespuestas AS (
          SELECT 
            idFolio,
            MAX(FechaRespuesta) as UltimaFecha
          FROM Folio_respuestas
          GROUP BY idFolio
        )
        SELECT 
          fr.*, 
          u.Nombre as NombreUsuario,
          f.Nombre as NombreFolio,
          f.Prioridad
        FROM Folio_respuestas fr
        INNER JOIN UltimasRespuestas ur ON fr.idFolio = ur.idFolio 
          AND fr.FechaRespuesta = ur.UltimaFecha
        LEFT JOIN Usuarios u ON fr.idUsuario = u.idUsuario
        INNER JOIN Folios f ON fr.idFolio = f.idFolio
        ORDER BY fr.FechaRespuesta DESC
      `;
      const rows = await database.query(sql);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo últimas respuestas: ${error.message}`);
    }
  }
}

export default FolioRespuesta;
