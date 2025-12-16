/**
 * Script: Crear usuario sear gurgos
 * Crea un usuario específico en la base de datos
 */

const User = require('../src/models/User');
const { sequelize } = require('../src/config/database');

async function createUser() {
  try {
    console.log('🔄 Creando usuario de prueba userpro1...\n');

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      where: { username: 'userpro1' } 
    });

    if (existingUser) {
      console.log('⚠️  El usuario "userpro1" ya existe');
      console.log('   ID:', existingUser.id);
      console.log('   Email:', existingUser.email);
      console.log('   Role:', existingUser.role);
      console.log('\n✅ Puedes iniciar sesión con:');
      console.log('   Username: userpro1');
      console.log('   Password: 12345678a!');
      return;
    }

    // Crear el usuario
    const user = await User.create({
      username: 'userpro1',
      name: 'User Pro 1', // Columna antigua (aún existe en la BD)
      firstName: 'User',
      lastName: 'Pro 1',
      email: 'userpro1@example.com',
      password: '12345678a!', // Se encriptará automáticamente
      areaOfWork: 'agriculture',
      companyName: 'ORUS Agriculture',
      companyWebsite: 'https://orus-agriculture.com',
      phone: '+1234567890',
      role: 'user', // Rol de usuario regular
      is_active: true
    });

    console.log('✅ Usuario creado exitosamente!\n');
    console.log('📋 Detalles del usuario:');
    console.log('   ID:', user.id);
    console.log('   Username:', user.username);
    console.log('   Email:', user.email);
    console.log('   Nombre:', user.firstName, user.lastName);
    console.log('   Role:', user.role);
    console.log('   Compañía:', user.companyName);
    console.log('   Área:', user.areaOfWork);
    console.log('   Activo:', user.is_active ? 'Sí' : 'No');
    
    console.log('\n✅ Credenciales para iniciar sesión:');
    console.log('   Username: userpro1');
    console.log('   Password: 12345678a!');
    console.log('\n🌐 Abre el navegador en: http://localhost:5173');
    console.log('   Y usa estas credenciales para iniciar sesión');

  } catch (error) {
    console.error('\n❌ Error al crear usuario:', error.message);
    
    if (error.name === 'SequelizeValidationError') {
      console.error('\n📋 Errores de validación:');
      error.errors.forEach(err => {
        console.error('   -', err.message);
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('   El username o email ya están registrados');
    }
  }
}

// Ejecutar
(async () => {
  try {
    await createUser();
    process.exit(0);
  } catch (error) {
    console.error('Error inesperado:', error);
    process.exit(1);
  }
})();
