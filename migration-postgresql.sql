-- Script para migrar de SQLite a PostgreSQL
-- Usar este script si decides migrar a una base de datos en la nube

-- Tabla Usuarios (versión PostgreSQL)
CREATE TABLE IF NOT EXISTS Usuarios (
    idUsuario SERIAL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Usuario VARCHAR(100) NOT NULL UNIQUE,
    Correo VARCHAR(255) NOT NULL UNIQUE,
    Contraseña VARCHAR(255) NOT NULL,
    idDepartamento INTEGER,
    idRol INTEGER,
    idPlanta INTEGER,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO Usuarios (Nombre, Usuario, Correo, Contraseña, idDepartamento, idRol, idPlanta) VALUES
('Andrés Ramos', 'aramos', 'aramos@ezimetales.com.mx', '12345', 1, 1, 4),
('Bárbara Cisneros', 'bcisne', 'bcisne@ezimetales.com.mx', '12345', 2, 1, 1),
('Alan Juarez', 'ajuarez', 'ajuarez@ezimetales.com.mx', '12345', 2, 2, 2);
