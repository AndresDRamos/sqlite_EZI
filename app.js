// app.js - Aplicación simple con SQLite
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Conexión a base de datos
const db = new sqlite3.Database(path.join(__dirname, 'ventanilla.db'));

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Ventanilla CH - SQLite Simple',
    endpoints: [
      'GET /usuarios - Ver todos los usuarios',
      'GET /usuarios/:id - Ver usuario específico',
      'POST /usuarios - Crear usuario'
    ]
  });
});

// Ver todos los usuarios
app.get('/usuarios', (req, res) => {
  db.all('SELECT idUsuario, Nombre, Usuario, Correo, idDepartamento, idRol, idPlanta, FechaCreacion FROM Usuarios', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Ver usuario por ID
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT idUsuario, Nombre, Usuario, Correo, idDepartamento, idRol, idPlanta, FechaCreacion FROM Usuarios WHERE idUsuario = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.json(row);
    }
  });
});

// Crear usuario
app.post('/usuarios', (req, res) => {
  const { Nombre, Usuario, Correo, Contraseña, idDepartamento, idRol, idPlanta } = req.body;
  
  if (!Nombre || !Usuario || !Correo || !Contraseña) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  db.run(
    'INSERT INTO Usuarios (Nombre, Usuario, Correo, Contraseña, idDepartamento, idRol, idPlanta) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [Nombre, Usuario, Correo, Contraseña, idDepartamento, idRol, idPlanta],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ message: 'Usuario creado', idUsuario: this.lastID });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
