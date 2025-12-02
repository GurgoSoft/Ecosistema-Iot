const { sequelize } = require('../src/config/database');
const User = require('../src/models/User');

async function listUsers() {
  await sequelize.authenticate();
  const users = await User.findAll({ raw: true });
  console.table(users);
  await sequelize.close();
}

listUsers().catch(err => {
  console.error('Error al listar usuarios:', err);
  process.exit(1);
});
