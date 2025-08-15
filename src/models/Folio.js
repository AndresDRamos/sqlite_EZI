// src/models/Folio.js - Modelo de Folio (ES Modules)
import database from '../../config/database-auto.js';

class Folio {
  constructor(data = {}) {
    this.idFolio = data.idFolio;
    this.FechaHora = data.FechaHora;
    this.Nombre = data.Nombre;
    this.CodigoEmpleado = data.CodigoEmpleado;
    this.Planta = data.Planta;
    this.EsquemaPago = data.EsquemaPago;
    this.TipoSolicitud = data.TipoSolicitud;
    this.Descripcion = data.Descripcion;
    this.Prioridad = data.Prioridad;
    this.FechaCreacion = data.FechaCreacion;
  }

  // Obtener todos los folios
  static async findAll() {
    try {
      const sql = `
        SELECT * 
        FROM Folios 
        ORDER BY FechaHora DESC
      `;
      const rows = await database.query(sql);
      return rows.map(row => new Folio(row));
    } catch (error) {
      throw new Error(`Error obteniendo folios: ${error.message}`);
    }
  }

  // Obtener folio por ID
  static async findById(id) {
    try {
      const sql = `
        SELECT * 
        FROM Folios 
        WHERE idFolio = ?
      `;
      const rows = await database.query(sql, [id]);
      return rows.length > 0 ? new Folio(rows[0]) : null;
    } catch (error) {
      throw new Error(`Error obteniendo folio: ${error.message}`);
    }
  }

  // Obtener folios por código de empleado
  static async findByCodigoEmpleado(codigo) {
    try {
      const sql = `
        SELECT * 
        FROM Folios 
        WHERE CodigoEmpleado = ?
        ORDER BY FechaHora DESC
      `;
      const rows = await database.query(sql, [codigo]);
      return rows.map(row => new Folio(row));
    } catch (error) {
      throw new Error(`Error obteniendo folios por código: ${error.message}`);
    }
  }

  // Obtener folios por prioridad
  static async findByPrioridad(prioridad) {
    try {
      const sql = `
        SELECT * 
        FROM Folios 
        WHERE Prioridad = ?
        ORDER BY FechaHora DESC
      `;
      const rows = await database.query(sql, [prioridad]);
      return rows.map(row => new Folio(row));
    } catch (error) {
      throw new Error(`Error obteniendo folios por prioridad: ${error.message}`);
    }
  }

  // Crear nuevo folio
  async save() {
    try {
      const sql = `
        INSERT INTO Folios (
          FechaHora, Nombre, CodigoEmpleado, Planta, 
          EsquemaPago, TipoSolicitud, Descripcion, Prioridad
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await database.query(sql, [
        this.FechaHora || new Date().toISOString(),
        this.Nombre,
        this.CodigoEmpleado,
        this.Planta,
        this.EsquemaPago,
        this.TipoSolicitud,
        this.Descripcion,
        this.Prioridad
      ]);
      this.idFolio = result.lastID;
      return this;
    } catch (error) {
      throw new Error(`Error creando folio: ${error.message}`);
    }
  }

  // Actualizar folio
  async update() {
    try {
      const sql = `
        UPDATE Folios 
        SET Nombre = ?, CodigoEmpleado = ?, Planta = ?, 
            EsquemaPago = ?, TipoSolicitud = ?, Descripcion = ?, 
            Prioridad = ?
        WHERE idFolio = ?
      `;
      await database.query(sql, [
        this.Nombre,
        this.CodigoEmpleado,
        this.Planta,
        this.EsquemaPago,
        this.TipoSolicitud,
        this.Descripcion,
        this.Prioridad,
        this.idFolio
      ]);
      return this;
    } catch (error) {
      throw new Error(`Error actualizando folio: ${error.message}`);
    }
  }

  // Eliminar folio
  async delete() {
    try {
      const sql = `DELETE FROM Folios WHERE idFolio = ?`;
      await database.query(sql, [this.idFolio]);
      return true;
    } catch (error) {
      throw new Error(`Error eliminando folio: ${error.message}`);
    }
  }

  // Obtener responsables del folio
  async getResponsables() {
    try {
      const sql = `
        SELECT u.idUsuario, u.Nombre, u.Correo, fr.FechaAsignacion
        FROM Folio_responsables fr
        INNER JOIN Usuarios u ON fr.idUsuario = u.idUsuario
        WHERE fr.idFolio = ?
        ORDER BY fr.FechaAsignacion
      `;
      const rows = await database.query(sql, [this.idFolio]);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo responsables: ${error.message}`);
    }
  }

  // Obtener respuestas del folio
  async getRespuestas() {
    try {
      const sql = `
        SELECT fr.*, u.Nombre as NombreUsuario
        FROM Folio_respuestas fr
        LEFT JOIN Usuarios u ON fr.idUsuario = u.idUsuario
        WHERE fr.idFolio = ?
        ORDER BY fr.FechaRespuesta
      `;
      const rows = await database.query(sql, [this.idFolio]);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo respuestas: ${error.message}`);
    }
  }
}

export default Folio;
