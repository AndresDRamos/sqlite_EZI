// src/routes/folios.js - Rutas para Folios (ES Modules)
import { Router } from 'express';
import FolioController from '../controllers/folioController.js';

const router = Router();

// GET /api/folios - Obtener todos los folios (con filtros opcionales)
// Query params: prioridad, codigoEmpleado, page, limit
router.get('/', FolioController.obtenerTodos);

// GET /api/folios/:id - Obtener folio por ID (incluye responsables y respuestas)
router.get('/:id', FolioController.obtenerPorId);

// POST /api/folios - Crear nuevo folio
router.post('/', FolioController.crear);

// PUT /api/folios/:id - Actualizar folio
router.put('/:id', FolioController.actualizar);

// DELETE /api/folios/:id - Eliminar folio
router.delete('/:id', FolioController.eliminar);

// POST /api/folios/:id/responsables - Asignar responsable a folio
router.post('/:id/responsables', FolioController.asignarResponsable);

// DELETE /api/folios/:id/responsables/:idUsuario - Remover responsable de folio
router.delete('/:id/responsables/:idUsuario', FolioController.removerResponsable);

// POST /api/folios/:id/respuestas - Agregar respuesta a folio
router.post('/:id/respuestas', FolioController.agregarRespuesta);

export default router;
