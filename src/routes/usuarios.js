// src/routes/usuarios.js - Rutas de Usuarios (ES Modules)
import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';

const router = express.Router();

// Rutas CRUD para usuarios
router.get('/', UsuarioController.index);           // GET /api/usuarios
router.get('/:id', UsuarioController.show);        // GET /api/usuarios/:id
router.post('/', UsuarioController.store);         // POST /api/usuarios
router.put('/:id', UsuarioController.update);      // PUT /api/usuarios/:id
router.delete('/:id', UsuarioController.destroy);  // DELETE /api/usuarios/:id

export default router;
