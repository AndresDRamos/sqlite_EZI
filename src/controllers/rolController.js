// src/controllers/rolController.js - Controlador de Roles (ES Modules)
import Rol from '../models/Rol.js';

class RolController {
  // Obtener todos los roles
  static async obtenerTodos(req, res) {
    try {
      const roles = await Rol.findAll();
      res.status(200).json({
        success: true,
        data: roles,
        mensaje: 'Roles obtenidos exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al obtener roles',
        error: error.message
      });
    }
  }

  // Obtener rol por ID
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const rol = await Rol.findById(id);
      
      if (!rol) {
        return res.status(404).json({
          success: false,
          mensaje: 'Rol no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: rol,
        mensaje: 'Rol obtenido exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al obtener rol',
        error: error.message
      });
    }
  }

  // Crear nuevo rol
  static async crear(req, res) {
    try {
      const { NombreRol } = req.body;

      if (!NombreRol) {
        return res.status(400).json({
          success: false,
          mensaje: 'El nombre del rol es requerido'
        });
      }

      const nuevoRol = new Rol({ NombreRol });
      await nuevoRol.save();

      res.status(201).json({
        success: true,
        data: nuevoRol,
        mensaje: 'Rol creado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al crear rol',
        error: error.message
      });
    }
  }

  // Actualizar rol
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { NombreRol } = req.body;

      if (!NombreRol) {
        return res.status(400).json({
          success: false,
          mensaje: 'El nombre del rol es requerido'
        });
      }

      const rol = await Rol.findById(id);
      if (!rol) {
        return res.status(404).json({
          success: false,
          mensaje: 'Rol no encontrado'
        });
      }

      rol.NombreRol = NombreRol;
      await rol.update();

      res.status(200).json({
        success: true,
        data: rol,
        mensaje: 'Rol actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al actualizar rol',
        error: error.message
      });
    }
  }

  // Eliminar rol
  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      const rol = await Rol.findById(id);
      
      if (!rol) {
        return res.status(404).json({
          success: false,
          mensaje: 'Rol no encontrado'
        });
      }

      await rol.delete();

      res.status(200).json({
        success: true,
        mensaje: 'Rol eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: 'Error al eliminar rol',
        error: error.message
      });
    }
  }
}

export default RolController;
