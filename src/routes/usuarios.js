// src/routes/usuarios.js - Rutas de Usuarios
const express = require('express');
const UsuarioController = require('../controllers/usuarioController');

const router = express.Router();

// Rutas CRUD para usuarios
router.get('/', UsuarioController.index);           // GET /api/usuarios
router.get('/:id', UsuarioController.show);        // GET /api/usuarios/:id
router.post('/', UsuarioController.store);         // POST /api/usuarios
router.put('/:id', UsuarioController.update);      // PUT /api/usuarios/:id
router.delete('/:id', UsuarioController.destroy);  // DELETE /api/usuarios/:id

module.exports = router;
