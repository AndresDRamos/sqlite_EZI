// database/migrate-postgres.js - Migración para PostgreSQL
import pg from 'pg';

const { Pool } = pg;

async function createTablesPostgres() {
  // Crear una conexión temporal solo para migraciones
  const connectionString = process.env.DATABASE_URL || 
                           process.env.POSTGRES_URL || 
                           process.env.DATABASE_PRIVATE_URL ||
                           process.env.DATABASE_PUBLIC_URL;

  if (!connectionString) {
    throw new Error('No se encontró URL de PostgreSQL para migración');
  }

  const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🚀 Iniciando migración PostgreSQL...');

    // Helper para ejecutar queries
    const query = async (sql, params = []) => {
      const result = await pool.query(sql, params);
      return result;
    };

    // Crear tabla Usuarios (adaptada para PostgreSQL)
    await query(`
      CREATE TABLE IF NOT EXISTS Usuarios (
        "idUsuario" SERIAL PRIMARY KEY,
        "Nombre" VARCHAR(255) NOT NULL,
        "Usuario" VARCHAR(100) NOT NULL UNIQUE,
        "Correo" VARCHAR(255) NOT NULL UNIQUE,
        "Contraseña" VARCHAR(255) NOT NULL,
        "idRol" INTEGER,
        "idPlanta" INTEGER,
        "FechaCreacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla Usuarios creada');

    // Crear tabla Roles
    await query(`
      CREATE TABLE IF NOT EXISTS "Roles" (
        "idRol" SERIAL PRIMARY KEY,
        "NombreRol" VARCHAR(100) NOT NULL UNIQUE
      )
    `);
    console.log('✅ Tabla Roles creada');

    // Insertar roles por defecto
    await query(`
      INSERT INTO "Roles" ("idRol", "NombreRol") VALUES 
      (1, 'Administrador'),
      (2, 'Solucionador')
      ON CONFLICT ("idRol") DO NOTHING
    `);
    console.log('✅ Roles por defecto insertados');

    // Crear tabla Folios
    await query(`
      CREATE TABLE IF NOT EXISTS Folios (
        idFolio SERIAL PRIMARY KEY,
        FechaHora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        Nombre VARCHAR(255) NOT NULL,
        CodigoEmpleado INTEGER NOT NULL,
        Planta VARCHAR(255) NOT NULL,
        EsquemaPago VARCHAR(255) NOT NULL,
        TipoSolicitud VARCHAR(255) NOT NULL,
        Descripcion TEXT NOT NULL,
        Prioridad VARCHAR(50) NOT NULL,
        FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla Folios creada');

    // Crear tabla Folio_responsables
    await query(`
      CREATE TABLE IF NOT EXISTS Folio_responsables (
        id SERIAL PRIMARY KEY,
        idFolio INTEGER NOT NULL,
        idUsuario INTEGER NOT NULL,
        FechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (idFolio) REFERENCES Folios(idFolio) ON DELETE CASCADE,
        FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE,
        UNIQUE(idFolio, idUsuario)
      )
    `);
    console.log('✅ Tabla Folio_responsables creada');

    // Crear tabla Folio_respuestas
    await query(`
      CREATE TABLE IF NOT EXISTS Folio_respuestas (
        idRespuesta SERIAL PRIMARY KEY,
        idFolio INTEGER NOT NULL,
        Respuesta TEXT NOT NULL,
        FechaRespuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
      try {
        await query(index);
      } catch (error) {
        // Los índices pueden ya existir, ignoramos errores
        console.log(`Info: ${error.message}`);
      }
    }
    console.log('✅ Índices procesados');

    // Insertar usuario admin por defecto si no existe
    const adminExists = await query(`
      SELECT COUNT(*) as count FROM "Usuarios" WHERE "Usuario" = $1
    `, ['admin']);
    
    if (adminExists.rows[0].count == 0) {
      await query(`
        INSERT INTO "Usuarios" ("Nombre", "Usuario", "Correo", "Contraseña", "idRol") 
        VALUES ($1, $2, $3, $4, $5)
      `, ['Administrador', 'admin', 'admin@ventanilla.com', 'admin123', 1]);
      console.log('✅ Usuario admin creado');
    } else {
      console.log('ℹ️  Usuario admin ya existe');
    }

    console.log('\n🎉 Migración PostgreSQL completada!');

  } catch (error) {
    console.error('❌ Error en migración PostgreSQL:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createTablesPostgres().catch(console.error);
}

export default createTablesPostgres;
