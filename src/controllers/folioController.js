// src/controllers/folioController.js - Controlador de Folios (ES Modules)
import Folio from '../models/Folio.js';
import FolioResponsable from '../models/FolioResponsable.js';
import FolioRespuesta from '../models/FolioRespuesta.js';

class FolioController {
  // Obtener todos los folios
  static async obtenerTodos(req, res) {
    try {
      const { prioridad, codigoEmpleado, page = 1, limit = 10 } = req.query;
      let folios;

      if (prioridad) {
        folios = await Folio.findByPrioridad(prioridad);
      } else if (codigoEmpleado) {
        folios = await Folio.findByCodigoEmpleado(parseInt(codigoEmpleado));
      } else {
        folios = await Folio.findAll();
      }

      // Paginación simple
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedFolios = folios.slice(startIndex, endIndex);

      res.status(200).json({
        success: true,
        data: paginatedFolios,
        pagination: {
          total: folios.length,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(folios.length / limit)
        },
        mensaje: 'Folios obtenidos exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al obtener folios',
        error: error.message
      });
    }
  }

  // Obtener folio por ID
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const folio = await Folio.findById(id);
      
      if (!folio) {
        return res.status(404).json({
          success: false,
          mensaje: 'Folio no encontrado'
        });
      }

      // Obtener responsables y respuestas
      const responsables = await folio.getResponsables();
      const respuestas = await folio.getRespuestas();

      res.status(200).json({
        success: true,
        data: {
          ...folio,
          responsables,
          respuestas
        },
        mensaje: 'Folio obtenido exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al obtener folio',
        error: error.message
      });
    }
  }

  // Crear nuevo folio
  static async crear(req, res) {
    try {
      const {
        FechaHora,
        Nombre,
        CodigoEmpleado,
        Planta,
        EsquemaPago,
        TipoSolicitud,
        Descripcion,
        Prioridad
      } = req.body;

      // Validaciones
      const camposRequeridos = [
        'Nombre', 'CodigoEmpleado', 'Planta', 
        'EsquemaPago', 'TipoSolicitud', 'Descripcion', 'Prioridad'
      ];

      const camposFaltantes = camposRequeridos.filter(campo => !req.body[campo]);
      if (camposFaltantes.length > 0) {
        return res.status(400).json({
          success: false,
          mensaje: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`
        });
      }

      // Validar que CodigoEmpleado sea un entero
      if (!Number.isInteger(parseInt(CodigoEmpleado))) {
        return res.status(400).json({
          success: false,
          mensaje: 'El código de empleado debe ser un número entero'
        });
      }

      const nuevoFolio = new Folio({
        FechaHora: FechaHora || new Date().toISOString(),
        Nombre,
        CodigoEmpleado: parseInt(CodigoEmpleado),
        Planta,
        EsquemaPago,
        TipoSolicitud,
        Descripcion,
        Prioridad
      });

      await nuevoFolio.save();

      res.status(201).json({
        success: true,
        data: nuevoFolio,
        mensaje: 'Folio creado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al crear folio',
        error: error.message
      });
    }
  }

  // Actualizar folio
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        Nombre,
        CodigoEmpleado,
        Planta,
        EsquemaPago,
        TipoSolicitud,
        Descripcion,
        Prioridad
      } = req.body;

      const folio = await Folio.findById(id);
      if (!folio) {
        return res.status(404).json({
          success: false,
          mensaje: 'Folio no encontrado'
        });
      }

      // Actualizar campos si se proporcionan
      if (Nombre) folio.Nombre = Nombre;
      if (CodigoEmpleado) folio.CodigoEmpleado = parseInt(CodigoEmpleado);
      if (Planta) folio.Planta = Planta;
      if (EsquemaPago) folio.EsquemaPago = EsquemaPago;
      if (TipoSolicitud) folio.TipoSolicitud = TipoSolicitud;
      if (Descripcion) folio.Descripcion = Descripcion;
      if (Prioridad) folio.Prioridad = Prioridad;

      await folio.update();

      res.status(200).json({
        success: true,
        data: folio,
        mensaje: 'Folio actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al actualizar folio',
        error: error.message
      });
    }
  }

  // Eliminar folio
  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      const folio = await Folio.findById(id);
      
      if (!folio) {
        return res.status(404).json({
          success: false,
          mensaje: 'Folio no encontrado'
        });
      }

      await folio.delete();

      res.status(200).json({
        success: true,
        mensaje: 'Folio eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al eliminar folio',
        error: error.message
      });
    }
  }

  // Asignar responsable a folio
  static async asignarResponsable(req, res) {
    try {
      const { id } = req.params;
      const { idUsuario } = req.body;

      if (!idUsuario) {
        return res.status(400).json({
          success: false,
          mensaje: 'El ID del usuario es requerido'
        });
      }

      const folioResponsable = new FolioResponsable({
        idFolio: parseInt(id),
        idUsuario: parseInt(idUsuario)
      });

      await folioResponsable.save();

      res.status(201).json({
        success: true,
        data: folioResponsable,
        mensaje: 'Responsable asignado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al asignar responsable',
        error: error.message
      });
    }
  }

  // Remover responsable de folio
  static async removerResponsable(req, res) {
    try {
      const { id, idUsuario } = req.params;

      const resultado = await FolioResponsable.removeResponsable(
        parseInt(id), 
        parseInt(idUsuario)
      );

      if (!resultado) {
        return res.status(404).json({
          success: false,
          mensaje: 'Asignación no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        mensaje: 'Responsable removido exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al remover responsable',
        error: error.message
      });
    }
  }

  // Agregar respuesta a folio
  static async agregarRespuesta(req, res) {
    try {
      const { id } = req.params;
      const { Respuesta, idUsuario } = req.body;

      if (!Respuesta) {
        return res.status(400).json({
          success: false,
          mensaje: 'La respuesta es requerida'
        });
      }

      const folioRespuesta = new FolioRespuesta({
        idFolio: parseInt(id),
        Respuesta,
        idUsuario: idUsuario ? parseInt(idUsuario) : null
      });

      await folioRespuesta.save();

      res.status(201).json({
        success: true,
        data: folioRespuesta,
        mensaje: 'Respuesta agregada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al agregar respuesta',
        error: error.message
      });
    }
  }
}

export default FolioController;
