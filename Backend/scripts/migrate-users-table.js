/**
 * Script de Migración: Actualizar tabla users
 * Ejecuta las modificaciones necesarias en la base de datos
 * para soportar los nuevos campos requeridos por el frontend
 */

const { sequelize } = require('../src/config/database');

async function migrateUsersTable() {
  try {
    console.log('🔄 Iniciando migración de tabla users...\n');

    // PASO 1: Agregar nuevas columnas
    console.log('📝 Paso 1: Agregando nuevas columnas...');
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS username VARCHAR(50),
      ADD COLUMN IF NOT EXISTS first_name VARCHAR(50),
      ADD COLUMN IF NOT EXISTS last_name VARCHAR(50),
      ADD COLUMN IF NOT EXISTS area_of_work VARCHAR(50),
      ADD COLUMN IF NOT EXISTS company_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS company_website VARCHAR(255);
    `);
    console.log('✅ Columnas agregadas\n');

    // PASO 2: Migrar datos existentes
    console.log('📝 Paso 2: Migrando datos existentes...');
    
    // Generar username a partir del email
    await sequelize.query(`
      UPDATE users 
      SET username = SPLIT_PART(email, '@', 1)
      WHERE username IS NULL;
    `);
    
    // Dividir 'name' en 'first_name' y 'last_name'
    await sequelize.query(`
      UPDATE users 
      SET 
        first_name = COALESCE(SPLIT_PART(name, ' ', 1), 'Usuario'),
        last_name = COALESCE(NULLIF(SPLIT_PART(name, ' ', 2), ''), 'Apellido')
      WHERE first_name IS NULL OR last_name IS NULL;
    `);
    
    // Establecer valores por defecto para campos institucionales
    await sequelize.query(`
      UPDATE users 
      SET 
        area_of_work = 'other',
        company_name = 'No especificado',
        company_website = 'https://example.com'
      WHERE area_of_work IS NULL;
    `);
    console.log('✅ Datos migrados\n');

    // PASO 3: Agregar constraint UNIQUE a username
    console.log('📝 Paso 3: Agregando restricción UNIQUE a username...');
    try {
      await sequelize.query(`
        ALTER TABLE users 
        ADD CONSTRAINT users_username_unique UNIQUE (username);
      `);
      console.log('✅ Restricción UNIQUE agregada\n');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Restricción UNIQUE ya existe\n');
      } else {
        throw error;
      }
    }

    // PASO 4: Hacer campos obligatorios (NOT NULL)
    console.log('📝 Paso 4: Estableciendo campos como NOT NULL...');
    await sequelize.query(`
      ALTER TABLE users 
      ALTER COLUMN username SET NOT NULL,
      ALTER COLUMN first_name SET NOT NULL,
      ALTER COLUMN last_name SET NOT NULL,
      ALTER COLUMN area_of_work SET NOT NULL,
      ALTER COLUMN company_name SET NOT NULL,
      ALTER COLUMN company_website SET NOT NULL;
    `);
    console.log('✅ Campos configurados como NOT NULL\n');

    // PASO 5: Actualizar ENUM de role si es necesario
    console.log('📝 Paso 5: Verificando ENUM de roles...');
    try {
      // Primero eliminar constraint si existe
      await sequelize.query(`
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
      `);
      
      // Agregar nuevo constraint con roles actualizados
      await sequelize.query(`
        ALTER TABLE users 
        ADD CONSTRAINT users_role_check 
        CHECK (role IN ('user', 'admin', 'viewer'));
      `);
      console.log('✅ ENUM de roles actualizado\n');
    } catch (error) {
      console.log('⚠️  Advertencia en actualización de roles:', error.message, '\n');
    }

    // VERIFICACIÓN: Mostrar estructura de la tabla
    console.log('📋 Verificación: Estructura de la tabla users');
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.table(columns);

    console.log('\n✅ ¡Migración completada exitosamente!');
    console.log('\n⚠️  NOTA IMPORTANTE:');
    console.log('   - La columna "name" antigua aún existe y puede ser eliminada manualmente');
    console.log('   - Se recomienda hacer un backup antes de eliminar columnas antiguas');

  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    console.error('\nDetalles:', error.message);
    throw error;
  }
}

// Ejecutar migración
(async () => {
  try {
    await migrateUsersTable();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ La migración falló');
    process.exit(1);
  }
})();
