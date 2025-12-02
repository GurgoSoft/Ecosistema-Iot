/**
 * Script para visualizar datos de la base de datos
 * Ejecutar: node tests/manual/viewDatabaseData.js
 */

require('dotenv').config();
const { sequelize } = require('../../src/config/database');
const { User, Crop, Sensor, SensorReading, setupAssociations } = require('../../src/models');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m'
};

const viewData = async () => {
  try {
    console.log(`${colors.cyan}
╔════════════════════════════════════════════════════╗
║      VISUALIZADOR DE DATOS - PostgreSQL            ║
╚════════════════════════════════════════════════════╝
${colors.reset}`);

    // Configurar asociaciones y conectar
    setupAssociations();
    await sequelize.authenticate();
    console.log(`${colors.green}✅ Conectado a la base de datos${colors.reset}\n`);

    // ========== USUARIOS ==========
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}           👥 USUARIOS${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'is_active', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`${colors.cyan}Usuario #${index + 1}:${colors.reset}`);
        console.log(`  ID:       ${user.id}`);
        console.log(`  Nombre:   ${user.name}`);
        console.log(`  Email:    ${user.email}`);
        console.log(`  Rol:      ${user.role}`);
        console.log(`  Activo:   ${user.is_active ? '✅ Sí' : '❌ No'}`);
        console.log(`  Creado:   ${new Date(user.created_at).toLocaleString()}`);
        console.log('');
      });
      console.log(`${colors.yellow}Total de usuarios: ${users.length}${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}No hay usuarios registrados${colors.reset}\n`);
    }

    // ========== CULTIVOS ==========
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}           🌾 CULTIVOS${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

    const crops = await Crop.findAll({
      include: [{
        model: User,
        as: 'owner',
        attributes: ['name', 'email']
      }],
      order: [['created_at', 'DESC']]
    });

    if (crops.length > 0) {
      crops.forEach((crop, index) => {
        console.log(`${colors.cyan}Cultivo #${index + 1}:${colors.reset}`);
        console.log(`  ID:           ${crop.id}`);
        console.log(`  Nombre:       ${crop.name}`);
        console.log(`  Tipo:         ${crop.type}`);
        console.log(`  Campo:        ${crop.field}`);
        console.log(`  Área:         ${crop.area} hectáreas`);
        console.log(`  Estado:       ${crop.status}`);
        console.log(`  Siembra:      ${crop.planting_date}`);
        console.log(`  Cosecha Est.: ${crop.expected_harvest_date}`);
        if (crop.owner) {
          console.log(`  Dueño:        ${crop.owner.name} (${crop.owner.email})`);
        }
        console.log('');
      });
      console.log(`${colors.yellow}Total de cultivos: ${crops.length}${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}No hay cultivos registrados${colors.reset}\n`);
    }

    // ========== SENSORES ==========
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}           📡 SENSORES${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

    const sensors = await Sensor.findAll({
      include: [{
        model: Crop,
        as: 'crop',
        attributes: ['name', 'field']
      }],
      order: [['created_at', 'DESC']]
    });

    if (sensors.length > 0) {
      sensors.forEach((sensor, index) => {
        console.log(`${colors.cyan}Sensor #${index + 1}:${colors.reset}`);
        console.log(`  ID:           ${sensor.id}`);
        console.log(`  Sensor ID:    ${sensor.sensor_id}`);
        console.log(`  Nombre:       ${sensor.name}`);
        console.log(`  Tipo:         ${sensor.type}`);
        console.log(`  Estado:       ${sensor.status}`);
        console.log(`  Campo:        ${sensor.field || 'N/A'}`);
        if (sensor.crop) {
          console.log(`  Cultivo:      ${sensor.crop.name}`);
        }
        if (sensor.last_reading) {
          console.log(`  Última lectura:`);
          console.log(`    - Temp:     ${sensor.last_reading.temperature || 'N/A'}°C`);
          console.log(`    - Humedad:  ${sensor.last_reading.humidity || 'N/A'}%`);
          console.log(`    - Suelo:    ${sensor.last_reading.soil_moisture || 'N/A'}%`);
        }
        console.log('');
      });
      console.log(`${colors.yellow}Total de sensores: ${sensors.length}${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}No hay sensores registrados${colors.reset}\n`);
    }

    // ========== LECTURAS DE SENSORES ==========
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}      📊 LECTURAS DE SENSORES${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

    const readings = await SensorReading.findAll({
      include: [{
        model: Sensor,
        as: 'sensor',
        attributes: ['sensor_id', 'name']
      }],
      order: [['timestamp', 'DESC']],
      limit: 10 // Solo las últimas 10 lecturas
    });

    if (readings.length > 0) {
      console.log(`${colors.cyan}Últimas 10 lecturas:${colors.reset}\n`);
      readings.forEach((reading, index) => {
        console.log(`${colors.cyan}Lectura #${index + 1}:${colors.reset}`);
        console.log(`  Sensor:     ${reading.sensor?.name || 'N/A'} (${reading.sensor?.sensor_id || 'N/A'})`);
        console.log(`  Fecha:      ${new Date(reading.timestamp).toLocaleString()}`);
        console.log(`  Temp:       ${reading.temperature || 'N/A'}°C`);
        console.log(`  Humedad:    ${reading.humidity || 'N/A'}%`);
        console.log(`  Suelo:      ${reading.soil_moisture || 'N/A'}%`);
        console.log(`  Luz:        ${reading.light || 'N/A'}`);
        console.log(`  pH:         ${reading.ph || 'N/A'}`);
        if (reading.alerts && reading.alerts.length > 0) {
          console.log(`  Alertas:    ${reading.alerts.length}`);
        }
        console.log('');
      });
      
      const totalReadings = await SensorReading.count();
      console.log(`${colors.yellow}Total de lecturas: ${totalReadings}${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}No hay lecturas de sensores${colors.reset}\n`);
    }

    // ========== RESUMEN ==========
    console.log(`${colors.green}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.green}           📈 RESUMEN${colors.reset}`);
    console.log(`${colors.green}═══════════════════════════════════════${colors.reset}\n`);

    const totalUsers = await User.count();
    const totalCrops = await Crop.count();
    const totalSensors = await Sensor.count();
    const totalReadings = await SensorReading.count();

    console.log(`  👥 Usuarios:          ${totalUsers}`);
    console.log(`  🌾 Cultivos:          ${totalCrops}`);
    console.log(`  📡 Sensores:          ${totalSensors}`);
    console.log(`  📊 Lecturas:          ${totalReadings}`);
    console.log('');

  } catch (error) {
    console.error(`${colors.red}❌ Error:${colors.reset}`, error.message);
  } finally {
    await sequelize.close();
    console.log(`\n${colors.green}✅ Conexión cerrada${colors.reset}\n`);
  }
};

viewData();
