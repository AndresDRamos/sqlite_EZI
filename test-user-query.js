// test-user-query.js - Test para debuggear la consulta de usuarios
import database from './config/database-auto.js';

async function testUserQuery() {
  try {
    console.log('🧪 Probando consulta de usuarios...');
    
    await database.connect();
    console.log('✅ Conectado a base de datos');
    
    // Probar la consulta exacta que está fallando
    const sql = `
      SELECT idUsuario, Nombre, Usuario, Correo, idRol, idPlanta, FechaCreacion 
      FROM Usuarios 
      ORDER BY Nombre
    `;
    
    console.log('📝 SQL a ejecutar:', sql);
    
    const rows = await database.query(sql);
    console.log('📊 Resultados:');
    console.log('- Número de filas:', rows.length);
    console.log('- Datos:', JSON.stringify(rows, null, 2));
    
    if (rows.length > 0) {
      console.log('✅ Primera fila:', rows[0]);
      console.log('🔍 Claves del objeto:', Object.keys(rows[0]));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await database.close();
  }
}

testUserQuery();
