// server.js - Servidor Express con API para Usuarios
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const Database = require('./database-config');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Ventanilla CH funcionando',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Inicializar base de datos y servidor
async function startServer() {
  try {
    const db = new Database();
    await db.connect();
    
    // Hacer la instancia de base de datos disponible globalmente
    app.locals.db = db;
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Error iniciando servidor:', error);
    process.exit(1);
  }
}

startServer();
