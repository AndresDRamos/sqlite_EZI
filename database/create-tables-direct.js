// database/create-tables-direct.js - Script directo para crear tablas
import database from '../config/database.js';

console.log('🚀 Iniciando creación de tablas...');

try {
  await database.connect();
  console.log('✅ Conectado a la base de datos');

  // Crear tabla Roles
  await database.query(`
    CREATE TABLE IF NOT EXISTS Roles (
      idRol INTEGER PRIMARY KEY AUTOINCREMENT,
      NombreRol TEXT NOT NULL UNIQUE
    )
  `);
  console.log('✅ Tabla Roles creada');

  // Insertar roles por defecto
  await database.query(`
    INSERT OR IGNORE INTO Roles (idRol, NombreRol) VALUES 
    (1, 'Administrador'),
    (2, 'Solucionador')
  `);
  console.log('✅ Roles por defecto insertados');

  // Crear tabla Folios
  await database.query(`
    CREATE TABLE IF NOT EXISTS Folios (
      idFolio INTEGER PRIMARY KEY AUTOINCREMENT,
      FechaHora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      Nombre TEXT NOT NULL,
      CodigoEmpleado INTEGER NOT NULL,
      Planta TEXT NOT NULL,
      EsquemaPago TEXT NOT NULL,
      TipoSolicitud TEXT NOT NULL,
      Descripcion TEXT NOT NULL,
      Prioridad TEXT NOT NULL,
      FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Tabla Folios creada');

  // Crear tabla Folio_responsables
  await database.query(`
    CREATE TABLE IF NOT EXISTS Folio_responsables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idFolio INTEGER NOT NULL,
      idUsuario INTEGER NOT NULL,
      FechaAsignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idFolio) REFERENCES Folios(idFolio) ON DELETE CASCADE,
      FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE,
      UNIQUE(idFolio, idUsuario)
    )
  `);
  console.log('✅ Tabla Folio_responsables creada');

  // Crear tabla Folio_respuestas
  await database.query(`
    CREATE TABLE IF NOT EXISTS Folio_respuestas (
      idRespuesta INTEGER PRIMARY KEY AUTOINCREMENT,
      idFolio INTEGER NOT NULL,
      Respuesta TEXT NOT NULL,
      FechaRespuesta DATETIME DEFAULT CURRENT_TIMESTAMP,
      idUsuario INTEGER,
      FOREIGN KEY (idFolio) REFERENCES Folios(idFolio) ON DELETE CASCADE,
      FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE SET NULL
    )
  `);
  console.log('✅ Tabla Folio_respuestas creada');

  // Crear índices
  const indices = [
    'CREATE INDEX IF NOT EXISTS idx_folios_fecha ON Folios(FechaHora)',
    'CREATE INDEX IF NOT EXISTS idx_folios_codigo ON Folios(CodigoEmpleado)',
    'CREATE INDEX IF NOT EXISTS idx_folio_responsables_folio ON Folio_responsables(idFolio)',
    'CREATE INDEX IF NOT EXISTS idx_folio_respuestas_folio ON Folio_respuestas(idFolio)',
    'CREATE INDEX IF NOT EXISTS idx_folio_respuestas_fecha ON Folio_respuestas(FechaRespuesta)'
  ];

  for (const index of indices) {
    await database.query(index);
  }
  console.log('✅ Índices creados');

  console.log('\n🎉 ¡Todas las tablas han sido creadas exitosamente!');

} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await database.close();
  console.log('🔐 Conexión cerrada');
}
