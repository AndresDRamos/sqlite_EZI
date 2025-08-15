// database/cleanup-postgres.js - Limpieza de tablas duplicadas en PostgreSQL
import pg from 'pg';

const { Pool } = pg;

async function cleanupPostgresTables() {
  const connectionString = process.env.DATABASE_URL || 
                           process.env.POSTGRES_URL || 
                           process.env.DATABASE_PRIVATE_URL ||
                           process.env.DATABASE_PUBLIC_URL;

  if (!connectionString) {
    throw new Error('No se encontró URL de PostgreSQL');
  }

  console.log('🧹 Iniciando limpieza de base de datos PostgreSQL...');
  console.log('🔗 Conectando a:', connectionString.substring(0, 30) + '...');

  const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // PASO 1: Ver todas las tablas existentes
    console.log('\n🔍 Analizando tablas existentes...');
    
    const existingTables = await pool.query(`
      SELECT table_name, table_schema
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas encontradas:');
    existingTables.rows.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });

    // PASO 2: Ver índices existentes
    console.log('\n🔍 Analizando índices existentes...');
    
    const existingIndexes = await pool.query(`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
      ORDER BY tablename, indexname
    `);
    
    console.log('🔧 Índices encontrados:');
    existingIndexes.rows.forEach((index, i) => {
      console.log(`   ${i + 1}. ${index.indexname} (en tabla: ${index.tablename})`);
    });

    // PASO 3: Definir tablas que QUEREMOS mantener (con formato correcto)
    const tablasRequeridas = [
      'Roles',           // Con mayúscula inicial
      'Usuarios',        // Con mayúscula inicial  
      'Folios',          // Con mayúscula inicial
      'Folio_responsables',
      'Folio_respuestas'
    ];

    console.log('\n✅ Tablas que DEBEMOS mantener:');
    tablasRequeridas.forEach(tabla => {
      console.log(`   ✓ ${tabla}`);
    });

    // PASO 4: Identificar tablas a eliminar
    const tablasActuales = existingTables.rows.map(row => row.table_name);
    const tablasAEliminar = tablasActuales.filter(tabla => 
      !tablasRequeridas.includes(tabla)
    );

    if (tablasAEliminar.length > 0) {
      console.log('\n🗑️  Tablas que se eliminarán:');
      tablasAEliminar.forEach(tabla => {
        console.log(`   ❌ ${tabla}`);
      });

      // PASO 5: Eliminar tablas no deseadas (con CASCADE para manejar dependencias)
      console.log('\n🧹 Eliminando tablas innecesarias...');
      
      for (const tabla of tablasAEliminar) {
        try {
          await pool.query(`DROP TABLE IF EXISTS "${tabla}" CASCADE`);
          console.log(`   ✅ Eliminada: ${tabla}`);
        } catch (error) {
          console.log(`   ⚠️  Error eliminando ${tabla}: ${error.message}`);
        }
      }
    } else {
      console.log('\n✨ No hay tablas innecesarias que eliminar');
    }

    // PASO 6: Verificar que las tablas requeridas existen
    console.log('\n🔍 Verificando tablas requeridas...');
    
    for (const tablaRequerida of tablasRequeridas) {
      const existe = tablasActuales.includes(tablaRequerida);
      if (existe) {
        console.log(`   ✅ ${tablaRequerida} - OK`);
      } else {
        console.log(`   ❌ ${tablaRequerida} - FALTA (se creará en la migración)`);
      }
    }

    // PASO 7: Estado final
    console.log('\n📊 Estado final de la base de datos...');
    
    const finalTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas finales:');
    finalTables.rows.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });

    // Contar registros en tablas principales
    try {
      const userCount = await pool.query('SELECT COUNT(*) as count FROM "Usuarios"');
      const roleCount = await pool.query('SELECT COUNT(*) as count FROM "Roles"');
      console.log(`👥 Usuarios: ${userCount.rows[0].count}`);
      console.log(`📋 Roles: ${roleCount.rows[0].count}`);
    } catch (error) {
      console.log('ℹ️  No se pudieron contar registros (es normal si las tablas no existen)');
    }

    console.log('\n🎉 ¡Limpieza completada exitosamente!');
    console.log('💡 Recomendación: Ejecuta la migración normal para crear tablas faltantes');

  } catch (error) {
    console.error('❌ Error en limpieza:', error.message);
    console.error('📍 Detalle:', error.detail || 'No hay detalles adicionales');
    throw error;
  } finally {
    await pool.end();
    console.log('🔐 Conexión cerrada');
  }
}

export default cleanupPostgresTables;
