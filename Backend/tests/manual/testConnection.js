/**
 * Script simple para verificar conexión a la base de datos
 */

require('dotenv').config();
const { sequelize } = require('../../src/config/database');
const { setupAssociations } = require('../../src/models');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}
╔════════════════════════════════════════════════════╗
║      TEST DE CONEXIÓN A BASE DE DATOS             ║
╚════════════════════════════════════════════════════╝
${colors.reset}`);

const testConnection = async () => {
  try {
    console.log('\n📡 Intentando conectar a PostgreSQL...\n');
    
    // Configurar asociaciones
    setupAssociations();
    
    // Autenticar conexión
    await sequelize.authenticate();
    
    console.log(`${colors.green}✅ Conexión exitosa!${colors.reset}`);
    console.log(`\nDetalles de la conexión:`);
    console.log(`  - Host: ${process.env.DB_HOST}`);
    console.log(`  - Base de datos: ${process.env.DB_NAME}`);
    console.log(`  - Usuario: ${process.env.DB_USER}`);
    console.log(`  - Puerto: ${process.env.DB_PORT}`);
    
    // Sincronizar modelos (sin forzar)
    console.log(`\n📊 Sincronizando modelos...`);
    await sequelize.sync({ alter: false });
    console.log(`${colors.green}✅ Modelos sincronizados!${colors.reset}`);
    
    // Listar tablas
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log(`\n📋 Tablas en la base de datos:`);
    results.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    console.log(`\n${colors.green}✅ Test completado exitosamente!${colors.reset}\n`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Error de conexión:${colors.reset}`);
    console.error(`  ${error.message}\n`);
    
    if (error.original) {
      console.error(`Detalles del error:`);
      console.error(`  - Código: ${error.original.code}`);
      console.error(`  - Detalle: ${error.original.detail || 'N/A'}\n`);
    }
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

testConnection();
