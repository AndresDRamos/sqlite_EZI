// src/routes/index.js - Router principal (ES Modules)
import express from 'express';
import usuariosRoutes from './usuarios.js';
import rolesRoutes from './roles.js';
import foliosRoutes from './folios.js';

const router = express.Router();

// Ruta principal de la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Ventanilla CH - Sistema de Gestión de Folios',
    version: '3.0.0',
    endpoints: {
      usuarios: {
        'GET /api/usuarios': 'Listar todos los usuarios',
        'GET /api/usuarios/:id': 'Obtener usuario por ID',
        'POST /api/usuarios': 'Crear nuevo usuario',
        'PUT /api/usuarios/:id': 'Actualizar usuario',
        'DELETE /api/usuarios/:id': 'Eliminar usuario'
      },
      roles: {
        'GET /api/roles': 'Listar todos los roles',
        'GET /api/roles/:id': 'Obtener rol por ID',
        'POST /api/roles': 'Crear nuevo rol',
        'PUT /api/roles/:id': 'Actualizar rol',
        'DELETE /api/roles/:id': 'Eliminar rol'
      },
      folios: {
        'GET /api/folios': 'Listar folios (filtros: prioridad, codigoEmpleado)',
        'GET /api/folios/:id': 'Obtener folio por ID con responsables y respuestas',
        'POST /api/folios': 'Crear nuevo folio',
        'PUT /api/folios/:id': 'Actualizar folio',
        'DELETE /api/folios/:id': 'Eliminar folio',
        'POST /api/folios/:id/responsables': 'Asignar responsable a folio',
        'DELETE /api/folios/:id/responsables/:idUsuario': 'Remover responsable de folio',
        'POST /api/folios/:id/respuestas': 'Agregar respuesta a folio'
      }
    },
    architecture: 'MVC (Model-View-Controller)',
    database: 'SQLite con 5 tablas: Usuarios, Roles, Folios, Folio_responsables, Folio_respuestas'
  });
});

// Montar rutas
router.use('/usuarios', usuariosRoutes);
router.use('/roles', rolesRoutes);
router.use('/folios', foliosRoutes);

export default router;
