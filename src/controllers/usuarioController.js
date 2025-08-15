// src/controllers/usuarioController.js - Controlador de Usuarios
const Usuario = require('../models/Usuario');

class UsuarioController {
  // GET /usuarios
  static async index(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      res.json({
        success: true,
        data: usuarios,
        message: 'Usuarios obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en usuarioController.index:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // GET /usuarios/:id
  static async show(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: usuario.toJSON(),
        message: 'Usuario obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en usuarioController.show:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // POST /usuarios
  static async store(req, res) {
    try {
      const { Nombre, Usuario, Correo, Contraseña, idRol, idPlanta } = req.body;

      // Validación básica
      if (!Nombre || !Usuario || !Correo || !Contraseña) {
        return res.status(400).json({
          success: false,
          error: 'Todos los campos son requeridos'
        });
      }

      const nuevoUsuario = new Usuario({
        Nombre, Usuario, Correo, Contraseña, idRol, idPlanta
      });

      await nuevoUsuario.save();

      res.status(201).json({
        success: true,
        data: nuevoUsuario.toJSON(),
        message: 'Usuario creado exitosamente'
      });
    } catch (error) {
      console.error('Error en usuarioController.store:', error);
      
      if (error.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({
          success: false,
          error: 'El usuario o correo ya existe'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Error interno del servidor',
          message: error.message
        });
      }
    }
  }

  // PUT /usuarios/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { Nombre, Usuario, Correo, idRol, idPlanta } = req.body;

      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      // Actualizar campos
      usuario.Nombre = Nombre || usuario.Nombre;
      usuario.Usuario = Usuario || usuario.Usuario;
      usuario.Correo = Correo || usuario.Correo;
      usuario.idRol = idRol !== undefined ? idRol : usuario.idRol;
      usuario.idPlanta = idPlanta !== undefined ? idPlanta : usuario.idPlanta;

      await usuario.save();

      res.json({
        success: true,
        data: usuario.toJSON(),
        message: 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error en usuarioController.update:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // DELETE /usuarios/:id
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      await usuario.delete();

      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error en usuarioController.destroy:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }
}

module.exports = UsuarioController;
