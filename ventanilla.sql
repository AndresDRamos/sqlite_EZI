-- Script para crear la base de datos Ventanilla CH
-- Tabla Usuarios
create    table IF not exists Usuarios (
          idUsuario integer primary KEY AUTOINCREMENT,
          Nombre TEXT not null,
          Usuario TEXT not null unique,
          Correo TEXT not null unique,
          Contraseña TEXT not null,
          idDepartamento integer,
          idRol integer,
          idPlanta integer,
          FechaCreacion DATETIME default current_timestamp
          )
;

-- Insertar algunos datos de ejemplo
insert    into Usuarios (
          Nombre,
          Usuario,
          Correo,
          Contraseña,
          idDepartamento,
          idRol,
          idPlanta
          )
values    (
          'Andrés Ramos',
          'aramos',
          'aramos@ezimetales.com.mx',
          '12345',
          1,
          1,
          4
          ),
          (
          'Bárbara Cisneros',
          'bcisne',
          'bcisne@ezimetales.com.mx',
          '12345',
          2,
          1,
          1
          ),
          (
          'Alan Juarez',
          'ajuarez',
          'ajuarez@ezimetales.com.mx',
          '12345',
          2,
          2,
          2
          )
;

-- Verificar que los datos se insertaron correctamente
select    *
from      Usuarios
;