// routes/usuarios.js - Rutas para gestionar usuarios
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usuarios = await db.query('SELECT idUsuario, Nombre, Usuario, Correo, idDepartamento, idRol, idPlanta, FechaCreacion FROM Usuarios');
    res.json(usuarios);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const usuarios = await db.query(
      'SELECT idUsuario, Nombre, Usuario, Correo, idDepartamento, idRol, idPlanta, FechaCreacion FROM Usuarios WHERE idUsuario = ?', 
      [id]
    );
    
    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuarios[0]);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/usuarios - Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { Nombre, Usuario, Correo, Contraseña, idDepartamento, idRol, idPlanta } = req.body;
    
    // Validar datos requeridos
    if (!Nombre || !Usuario || !Correo || !Contraseña) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(Contraseña, 10);
    
    const result = await db.query(
      'INSERT INTO Usuarios (Nombre, Usuario, Correo, Contraseña, idDepartamento, idRol, idPlanta) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Nombre, Usuario, Correo, hashedPassword, idDepartamento, idRol, idPlanta]
    );
    
    res.status(201).json({ 
      message: 'Usuario creado exitosamente', 
      idUsuario: result.lastID 
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'El usuario o correo ya existe' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { Nombre, Usuario, Correo, idDepartamento, idRol, idPlanta } = req.body;
    
    const result = await db.query(
      'UPDATE Usuarios SET Nombre = ?, Usuario = ?, Correo = ?, idDepartamento = ?, idRol = ?, idPlanta = ? WHERE idUsuario = ?',
      [Nombre, Usuario, Correo, idDepartamento, idRol, idPlanta, id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM Usuarios WHERE idUsuario = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
