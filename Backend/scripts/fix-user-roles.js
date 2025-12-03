/**
 * Script de corrección: Actualizar roles existentes
 * Convierte roles antiguos al nuevo sistema
 */

const { sequelize } = require('../src/config/database');

async function fixExistingRoles() {
  try {
    console.log('🔄 Corrigiendo roles existentes...\n');

    // Ver roles actuales
    console.log('📊 Roles actuales en la base de datos:');
    const [currentRoles] = await sequelize.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role;
    `);
    console.table(currentRoles);

    // Convertir roles antiguos al nuevo sistema
    console.log('\n📝 Convirtiendo roles antiguos al nuevo sistema...');
    console.log('   - "operator", "worker" → "user"');
    console.log('   - "manager" → "admin"\n');
    
    const [result1] = await sequelize.query(`
      UPDATE users 
      SET role = 'user' 
      WHERE role IN ('operator', 'worker');
    `);
    console.log(`✅ ${result1.rowCount || 0} usuarios convertidos a "user"`);
    
    const [result2] = await sequelize.query(`
      UPDATE users 
      SET role = 'admin' 
      WHERE role = 'manager';
    `);
    console.log(`✅ ${result2.rowCount || 0} usuarios convertidos a "admin"\n`);

    // Ahora intentar agregar el constraint
    console.log('📝 Agregando constraint de roles...');
    try {
      await sequelize.query(`
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
      `);
      
      await sequelize.query(`
        ALTER TABLE users 
        ADD CONSTRAINT users_role_check 
        CHECK (role IN ('user', 'admin', 'viewer'));
      `);
      console.log('✅ Constraint de roles agregado correctamente\n');
    } catch (error) {
      console.log('⚠️  Advertencia:', error.message, '\n');
    }

    // Verificar roles finales
    console.log('📊 Roles después de la corrección:');
    const [finalRoles] = await sequelize.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role;
    `);
    console.table(finalRoles);

    console.log('✅ ¡Corrección completada exitosamente!');

  } catch (error) {
    console.error('\n❌ Error durante la corrección:', error);
    console.error('\nDetalles:', error.message);
    throw error;
  }
}

// Ejecutar corrección
(async () => {
  try {
    await fixExistingRoles();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ La corrección falló');
    process.exit(1);
  }
})();
