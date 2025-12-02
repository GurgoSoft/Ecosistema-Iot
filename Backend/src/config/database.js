/**
 * Conexión a la base de datos PostgreSQL usando Sequelize
 * Maneja la conexión y los eventos de la base de datos
 */

const { Sequelize } = require('sequelize');
const config = require('./config');

/**
 * Crear instancia de Sequelize
 */
const sequelize = new Sequelize(
  config.database.database,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    logging: config.database.logging,
    pool: config.database.pool,
    define: {
      timestamps: true,
      underscored: true, // Usar snake_case para nombres de columnas
      freezeTableName: true // No pluralizar nombres de tablas
    }
  }
);

/**
 * Conectar a PostgreSQL
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ PostgreSQL conectado: ${config.database.host}:${config.database.port}`);
    console.log(`📊 Base de datos: ${config.database.database}`);
    
    // Sincronizar modelos en desarrollo (crear tablas si no existen)
    if (config.server.env === 'development') {
      await sequelize.sync({ alter: false }); // alter: true actualiza las tablas existentes
      console.log('✅ Modelos sincronizados con la base de datos');
    }
    
  } catch (error) {
    console.error('❌ Error al conectar a PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
