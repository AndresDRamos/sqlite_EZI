// database/migrate-postgres.js - Migración inteligente para PostgreSQL
import pg from 'pg';

const { Pool } = pg;

async function createPostgresTables() {
  const connectionString = process.env.DATABASE_URL || 
                           process.env.POSTGRES_URL || 
                           process.env.DATABASE_PRIVATE_URL ||
                           process.env.DATABASE_PUBLIC_URL;

  if (!connectionString) {
    throw new Error('No se encontró URL de PostgreSQL');
  }

  console.log('🚀 Iniciando migración inteligente PostgreSQL...');
  console.log('🔗 Conectando a:', connectionString.substring(0, 30) + '...');

  const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // PASO 1: Verificar qué tablas existen
    console.log('\n🔍 Verificando tablas existentes...');
    
    const existingTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tableNames = existingTables.rows.map(row => row.table_name);
    console.log('📋 Tablas existentes:', tableNames);

    // PASO 2: Crear tabla Roles si no existe
    if (!tableNames.includes('Roles')) {
      console.log('\n📋 Creando tabla Roles...');
      await pool.query(`
        CREATE TABLE "Roles" (
          "idRol" SERIAL PRIMARY KEY,
          "NombreRol" VARCHAR(100) NOT NULL UNIQUE
        )
      `);
      console.log('✅ Tabla Roles creada');
    } else {
      console.log('ℹ️  Tabla Roles ya existe');
    }

    // Verificar e insertar roles básicos
    const roleCount = await pool.query('SELECT COUNT(*) as count FROM "Roles"');
    if (roleCount.rows[0].count == 0) {
      await pool.query(`
        INSERT INTO "Roles" ("NombreRol") VALUES 
        ('Administrador'),
        ('Solucionador')
      `);
      console.log('✅ Roles básicos insertados');
    } else {
      console.log('ℹ️  Roles ya existen:', roleCount.rows[0].count);
    }

    // PASO 3: Crear tabla Usuarios si no existe
    if (!tableNames.includes('Usuarios')) {
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
    } else {
      console.log('ℹ️  Tabla Usuarios ya existe');
    }

    // PASO 4: Crear tabla Folios si no existe
    if (!tableNames.includes('Folios')) {
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
    } else {
      console.log('ℹ️  Tabla Folios ya existe');
    }

    // PASO 5: Crear tabla Folio_responsables si no existe
    if (!tableNames.includes('Folio_responsables')) {
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
    } else {
      console.log('ℹ️  Tabla Folio_responsables ya existe');
    }

    // PASO 6: Crear tabla Folio_respuestas si no existe
    if (!tableNames.includes('Folio_respuestas')) {
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
    } else {
      console.log('ℹ️  Tabla Folio_respuestas ya existe');
    }

    // PASO 7: Crear índices solo si no existen
    console.log('\n⚡ Verificando y creando índices...');
    
    // Verificar índices existentes
    const existingIndexes = await pool.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%'
    `);
    
    const indexNames = existingIndexes.rows.map(row => row.indexname);
    console.log('🔍 Índices existentes:', indexNames.length);

    const indices = [
      { name: 'idx_folios_fecha', sql: 'CREATE INDEX IF NOT EXISTS "idx_folios_fecha" ON "Folios"("FechaHora")' },
      { name: 'idx_folios_codigo', sql: 'CREATE INDEX IF NOT EXISTS "idx_folios_codigo" ON "Folios"("CodigoEmpleado")' },
      { name: 'idx_folio_responsables_folio', sql: 'CREATE INDEX IF NOT EXISTS "idx_folio_responsables_folio" ON "Folio_responsables"("idFolio")' },
      { name: 'idx_folio_respuestas_folio', sql: 'CREATE INDEX IF NOT EXISTS "idx_folio_respuestas_folio" ON "Folio_respuestas"("idFolio")' },
      { name: 'idx_folio_respuestas_fecha', sql: 'CREATE INDEX IF NOT EXISTS "idx_folio_respuestas_fecha" ON "Folio_respuestas"("FechaRespuesta")' },
      { name: 'idx_usuarios_usuario', sql: 'CREATE INDEX IF NOT EXISTS "idx_usuarios_usuario" ON "Usuarios"("Usuario")' },
      { name: 'idx_usuarios_correo', sql: 'CREATE INDEX IF NOT EXISTS "idx_usuarios_correo" ON "Usuarios"("Correo")' }
    ];

    for (const index of indices) {
      try {
        await pool.query(index.sql);
        console.log(`✅ Índice ${index.name} verificado/creado`);
      } catch (error) {
        // Los errores de índices existentes son normales
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Índice ${index.name} ya existe`);
        } else {
          console.log(`⚠️  Error con índice ${index.name}: ${error.message}`);
        }
      }
    }

    // VERIFICACIÓN FINAL
    console.log('\n📊 Verificando estructura final...');
    
    const finalTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas finales:');
    finalTables.rows.forEach(table => {
      console.log(`   ✓ ${table.table_name}`);
    });

    // Verificar datos en tablas principales
    const userCount = await pool.query('SELECT COUNT(*) as count FROM "Usuarios"');
    const roleCount2 = await pool.query('SELECT COUNT(*) as count FROM "Roles"');
    
    console.log(`👥 Usuarios: ${userCount.rows[0].count}`);
    console.log(`📋 Roles: ${roleCount2.rows[0].count}`);

    console.log('\n🎉 ¡Migración inteligente completada exitosamente!');
    console.log('📝 La tabla Usuarios está lista para el frontend');
    console.log('🔄 Los índices se crearon/verificaron correctamente');

  } catch (error) {
    console.error('❌ Error en migración:', error.message);
    console.error('📍 Detalle del error:', error.detail || 'No hay detalles adicionales');
    throw error;
  } finally {
    await pool.end();
    console.log('🔐 Conexión cerrada');
  }
}

export default createPostgresTables;
