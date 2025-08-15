// database/check-tables.js - Script para verificar las tablas creadas
import database from '../config/database.js';

async function checkTables() {
  try {
    await database.connect();
    console.log('🔍 Verificando tablas en la base de datos...\n');

    // Obtener lista de tablas
    const tables = await database.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);

    console.log('📋 Tablas encontradas:');
    tables.forEach(table => {
      console.log(`  - ${table.name}`);
    });

    // Verificar estructura de cada tabla nueva
    const newTables = ['Roles', 'Folios', 'Folio_responsables', 'Folio_respuestas'];
    
    for (const tableName of newTables) {
      console.log(`\n📊 Estructura de ${tableName}:`);
      try {
        // Usar una consulta simple para verificar si la tabla existe
        const testQuery = `SELECT COUNT(*) as count FROM ${tableName}`;
        const result = await database.query(testQuery);
        console.log(`  ✅ Tabla ${tableName} existe - ${result[0].count} registros`);
      } catch (error) {
        console.log(`  ❌ Error consultando ${tableName}: ${error.message}`);
      }
    }

    // Verificar datos en tabla Roles
    console.log('\n👥 Roles insertados:');
    try {
      const roles = await database.query('SELECT * FROM Roles');
      if (roles.length > 0) {
        roles.forEach(rol => {
          console.log(`  ID: ${rol.idRol} - ${rol.NombreRol}`);
        });
      } else {
        console.log('  No hay roles insertados');
      }
    } catch (error) {
      console.log(`  ❌ Error consultando roles: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await database.close();
  }
}

checkTables().catch(console.error);
