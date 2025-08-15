// database/fresh-postgres-migration.js - Migración limpia para PostgreSQL
import pg from 'pg';

const { Pool } = pg;

async function createFreshPostgresTables() {
  const connectionString = process.env.DATABASE_URL || 
                           process.env.POSTGRES_URL || 
                           process.env.DATABASE_PRIVATE_URL ||
                           process.env.DATABASE_PUBLIC_URL;

  if (!connectionString) {
    throw new Error('No se encontró URL de PostgreSQL');
  }

  console.log('🚀 Iniciando migración limpia PostgreSQL...');
  console.log('🔗 Conectando a:', connectionString.substring(0, 30) + '...');

  const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // PASO 1: Limpiar tablas existentes si existen
    console.log('\n🧹 Limpiando base de datos...');
    
    await pool.query('DROP TABLE IF EXISTS "Folio_respuestas" CASCADE');
    await pool.query('DROP TABLE IF EXISTS "Folio_responsables" CASCADE'); 
    await pool.query('DROP TABLE IF EXISTS "Folios" CASCADE');
    await pool.query('DROP TABLE IF EXISTS "Usuarios" CASCADE');
    await pool.query('DROP TABLE IF EXISTS "Roles" CASCADE');
    
    console.log('✅ Tablas anteriores eliminadas');

    // PASO 2: Crear tabla Roles primero
    console.log('\n📋 Creando tabla Roles...');
    await pool.query(`
      CREATE TABLE "Roles" (
        "idRol" SERIAL PRIMARY KEY,
        "NombreRol" VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    // Insertar roles básicos
    await pool.query(`
      INSERT INTO "Roles" ("NombreRol") VALUES 
      ('Administrador'),
      ('Solucionador')
    `);
    console.log('✅ Tabla Roles creada con datos básicos');

    // PASO 3: Crear tabla Usuarios (VACÍA)
    console.log('\n👥 Creando tabla Usuarios...');
    await pool.query(`
      CREATE TABLE "Usuarios" (
        "idUsuario" SERIAL PRIMARY KEY,
        "Nombre" VARCHAR(255) NOT NULL,
        "Usuario" VARCHAR(100) NOT NULL UNIQUE,
        "Correo" VARCHAR(255) NOT NULL UNIQUE,
        "Contraseña" VARCHAR(255) NOT NULL,
        "idRol" INTEGER REFERENCES "Roles"("idRol"),
        "idPlanta" INTEGER,
        "FechaCreacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla Usuarios creada (vacía, lista para el frontend)');

    // PASO 4: Crear tabla Folios
    console.log('\n📄 Creando tabla Folios...');
    await pool.query(`
      CREATE TABLE "Folios" (
        "idFolio" SERIAL PRIMARY KEY,
        "FechaHora" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "Nombre" VARCHAR(255) NOT NULL,
        "CodigoEmpleado" INTEGER NOT NULL,
        "Planta" VARCHAR(255) NOT NULL,
        "EsquemaPago" VARCHAR(255) NOT NULL,
        "TipoSolicitud" VARCHAR(255) NOT NULL,
        "Descripcion" TEXT NOT NULL,
        "Prioridad" VARCHAR(50) NOT NULL,
        "FechaCreacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla Folios creada');

    // PASO 5: Crear tabla Folio_responsables
    console.log('\n👤 Creando tabla Folio_responsables...');
    await pool.query(`
      CREATE TABLE "Folio_responsables" (
        "id" SERIAL PRIMARY KEY,
        "idFolio" INTEGER NOT NULL REFERENCES "Folios"("idFolio") ON DELETE CASCADE,
        "idUsuario" INTEGER NOT NULL REFERENCES "Usuarios"("idUsuario") ON DELETE CASCADE,
        "FechaAsignacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("idFolio", "idUsuario")
      )
    `);
    console.log('✅ Tabla Folio_responsables creada');

    // PASO 6: Crear tabla Folio_respuestas
    console.log('\n💬 Creando tabla Folio_respuestas...');
    await pool.query(`
      CREATE TABLE "Folio_respuestas" (
        "idRespuesta" SERIAL PRIMARY KEY,
        "idFolio" INTEGER NOT NULL REFERENCES "Folios"("idFolio") ON DELETE CASCADE,
        "Respuesta" TEXT NOT NULL,
        "FechaRespuesta" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "idUsuario" INTEGER REFERENCES "Usuarios"("idUsuario") ON DELETE SET NULL
      )
    `);
    console.log('✅ Tabla Folio_respuestas creada');

    // PASO 7: Crear índices para optimización
    console.log('\n⚡ Creando índices...');
    const indices = [
      'CREATE INDEX "idx_folios_fecha" ON "Folios"("FechaHora")',
      'CREATE INDEX "idx_folios_codigo" ON "Folios"("CodigoEmpleado")',
      'CREATE INDEX "idx_folio_responsables_folio" ON "Folio_responsables"("idFolio")',
      'CREATE INDEX "idx_folio_respuestas_folio" ON "Folio_respuestas"("idFolio")',
      'CREATE INDEX "idx_folio_respuestas_fecha" ON "Folio_respuestas"("FechaRespuesta")',
      'CREATE INDEX "idx_usuarios_usuario" ON "Usuarios"("Usuario")',
      'CREATE INDEX "idx_usuarios_correo" ON "Usuarios"("Correo")'
    ];

    for (const index of indices) {
      await pool.query(index);
    }
    console.log('✅ Índices creados');

    // VERIFICACIÓN: Mostrar estructura creada
    console.log('\n📊 Verificando estructura creada...');
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas creadas:');
    tables.rows.forEach(table => {
      console.log(`   ✓ ${table.table_name}`);
    });

    // Verificar que Usuarios esté vacía
    const userCount = await pool.query('SELECT COUNT(*) as count FROM "Usuarios"');
    console.log(`👥 Usuarios en tabla: ${userCount.rows[0].count} (perfecto, está vacía)`);

    // Verificar roles
    const roleCount = await pool.query('SELECT COUNT(*) as count FROM "Roles"');
    console.log(`📋 Roles en tabla: ${roleCount.rows[0].count}`);

    console.log('\n🎉 ¡Base de datos PostgreSQL creada exitosamente desde cero!');
    console.log('📝 La tabla Usuarios está vacía y lista para recibir datos del frontend');

  } catch (error) {
    console.error('❌ Error en migración:', error);
    throw error;
  } finally {
    await pool.end();
    console.log('🔐 Conexión cerrada');
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createFreshPostgresTables().catch(console.error);
}

export default createFreshPostgresTables;
