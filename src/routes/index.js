// src/routes/index.js - Router principal
const express = require('express');
const usuariosRoutes = require('./usuarios');

const router = express.Router();

// Ruta principal de la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Ventanilla CH - Arquitectura MVC',
    version: '2.0.0',
    endpoints: {
      usuarios: {
        'GET /api/usuarios': 'Listar todos los usuarios',
        'GET /api/usuarios/:id': 'Obtener usuario por ID',
        'POST /api/usuarios': 'Crear nuevo usuario',
        'PUT /api/usuarios/:id': 'Actualizar usuario',
        'DELETE /api/usuarios/:id': 'Eliminar usuario'
      }
    },
    architecture: 'MVC (Model-View-Controller)'
  });
});

// Montar rutas
router.use('/usuarios', usuariosRoutes);

module.exports = router;
