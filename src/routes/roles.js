// src/routes/roles.js - Rutas para Roles (ES Modules)
import { Router } from 'express';
import RolController from '../controllers/rolController.js';

const router = Router();

// GET /api/roles - Obtener todos los roles
router.get('/', RolController.obtenerTodos);

// GET /api/roles/:id - Obtener rol por ID
router.get('/:id', RolController.obtenerPorId);

// POST /api/roles - Crear nuevo rol
router.post('/', RolController.crear);

// PUT /api/roles/:id - Actualizar rol
router.put('/:id', RolController.actualizar);

// DELETE /api/roles/:id - Eliminar rol
router.delete('/:id', RolController.eliminar);

export default router;
