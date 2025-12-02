const { sequelize } = require('../src/config/database');
const User = require('../src/models/User');

async function seedUsers() {
  await sequelize.authenticate();

  const users = [
    {
      name: 'Admin Test',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'Manager Test',
      email: 'manager@test.com',
      password: 'manager123',
      role: 'manager'
    },
    {
      name: 'Worker Test',
      email: 'worker@test.com',
      password: 'worker123',
      role: 'worker'
    },
    {
      name: 'rubendev',
      email: 'rubendev@test.com',
      password: 'rubendev123',
      role: 'worker'
    }
  ];

  for (const userData of users) {
    const exists = await User.findOne({ where: { email: userData.email } });
    if (!exists) {
      await User.create(userData); // UUID generado automáticamente
      console.log(`Usuario creado: ${userData.email}`);
    } else {
      console.log(`Usuario ya existe: ${userData.email}`);
    }
  }

  await sequelize.close();
  console.log('Seed finalizado.');
}

seedUsers().catch(err => {
  console.error('Error al crear usuarios:', err);
  process.exit(1);
});
