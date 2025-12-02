/**
 * Tests unitarios para el modelo User
 */

const User = require('../../src/models/User');
const { sequelize } = require('../../src/config/database');

describe('User Model', () => {
  beforeAll(async () => {
    // Conectar a la base de datos de test
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  afterEach(async () => {
    // Limpiar datos después de cada test
    await User.destroy({ where: {}, truncate: true });
  });

  describe('Crear Usuario', () => {
    test('Debe crear un usuario correctamente', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);

      expect(user.id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe('user');
      expect(user.is_active).toBe(true);
    });

    test('Debe encriptar la contraseña', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);

      expect(user.password).not.toBe(userData.password);
      expect(user.password.length).toBeGreaterThan(20);
    });

    test('No debe permitir email duplicado', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await User.create(userData);

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('No debe permitir crear usuario sin campos requeridos', async () => {
      await expect(User.create({ name: 'Test' })).rejects.toThrow();
    });
  });

  describe('Métodos del Usuario', () => {
    test('comparePassword debe validar contraseña correcta', async () => {
      const password = 'password123';
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password
      });

      const isMatch = await user.comparePassword(password);
      expect(isMatch).toBe(true);
    });

    test('comparePassword debe rechazar contraseña incorrecta', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const isMatch = await user.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
    });

    test('toJSON no debe incluir la contraseña', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const userJSON = user.toJSON();
      expect(userJSON.password).toBeUndefined();
      expect(userJSON.name).toBeDefined();
    });
  });
});
