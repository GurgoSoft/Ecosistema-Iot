/**
 * Script de testing manual para probar todos los endpoints del backend
 * Ejecutar: npm run test:routes
 */

const axios = require('axios');

// Configuración
const BASE_URL = 'http://localhost:5000/api';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Variables globales para el test
let adminToken = '';
let userId = '';
let cropId = '';
let sensorId = '';

/**
 * Función para hacer logs coloridos
 */
const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`)
};

/**
 * Función para hacer peticiones HTTP
 */
const request = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      ...(data && { data })
    };

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Test de Health Check
 */
const testHealthCheck = async () => {
  log.section('TEST 1: HEALTH CHECK');
  
  const result = await request('GET', '/health');
  
  if (result.success) {
    log.success(`Health check OK - Status: ${result.status}`);
    log.info(`Respuesta: ${JSON.stringify(result.data)}`);
    return true;
  } else {
    log.error(`Health check falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Registro de Usuario
 */
const testRegister = async () => {
  log.section('TEST 2: REGISTRO DE USUARIO');
  
  const userData = {
    name: 'Usuario Test Admin',
    email: `admin.test.${Date.now()}@example.com`,
    password: 'test123456',
    role: 'admin',
    phone: '+1234567890',
    address: 'Dirección de prueba'
  };

  const result = await request('POST', '/auth/register', userData);
  
  if (result.success) {
    adminToken = result.data.data.token;
    userId = result.data.data.user.id;
    log.success(`Usuario registrado correctamente`);
    log.info(`ID: ${userId}`);
    log.info(`Token generado: ${adminToken.substring(0, 20)}...`);
    return true;
  } else {
    log.error(`Registro falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Login
 */
const testLogin = async () => {
  log.section('TEST 3: LOGIN');
  
  // Primero crear un usuario para login
  const email = `user.test.${Date.now()}@example.com`;
  const password = 'test123456';
  
  await request('POST', '/auth/register', {
    name: 'Usuario Login Test',
    email,
    password
  });

  const result = await request('POST', '/auth/login', { email, password });
  
  if (result.success) {
    log.success(`Login exitoso`);
    log.info(`Token: ${result.data.data.token.substring(0, 20)}...`);
    return true;
  } else {
    log.error(`Login falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Obtener Usuario Actual
 */
const testGetMe = async () => {
  log.section('TEST 4: OBTENER USUARIO ACTUAL');
  
  const result = await request('GET', '/auth/me', null, adminToken);
  
  if (result.success) {
    log.success(`Usuario obtenido correctamente`);
    log.info(`Nombre: ${result.data.data.name}`);
    log.info(`Email: ${result.data.data.email}`);
    log.info(`Rol: ${result.data.data.role}`);
    return true;
  } else {
    log.error(`Obtener usuario falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Listar Usuarios
 */
const testGetUsers = async () => {
  log.section('TEST 5: LISTAR USUARIOS');
  
  const result = await request('GET', '/users', null, adminToken);
  
  if (result.success) {
    log.success(`Usuarios listados correctamente`);
    log.info(`Total de usuarios: ${result.data.total}`);
    log.info(`Usuarios en página: ${result.data.count}`);
    return true;
  } else {
    log.error(`Listar usuarios falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Crear Cultivo
 */
const testCreateCrop = async () => {
  log.section('TEST 6: CREAR CULTIVO');
  
  const cropData = {
    name: 'Maíz Lote Test',
    type: 'cereal',
    field: 'Campo Norte',
    area: 5.5,
    latitude: 4.6097,
    longitude: -74.0817,
    planting_date: '2024-01-15',
    expected_harvest_date: '2024-06-15',
    notes: 'Cultivo de prueba para testing'
  };

  const result = await request('POST', '/crops', cropData, adminToken);
  
  if (result.success) {
    cropId = result.data.data.id;
    log.success(`Cultivo creado correctamente`);
    log.info(`ID: ${cropId}`);
    log.info(`Nombre: ${result.data.data.name}`);
    return true;
  } else {
    log.error(`Crear cultivo falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Listar Cultivos
 */
const testGetCrops = async () => {
  log.section('TEST 7: LISTAR CULTIVOS');
  
  const result = await request('GET', '/crops', null, adminToken);
  
  if (result.success) {
    log.success(`Cultivos listados correctamente`);
    log.info(`Total de cultivos: ${result.data.total}`);
    return true;
  } else {
    log.error(`Listar cultivos falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Obtener Cultivo por ID
 */
const testGetCrop = async () => {
  log.section('TEST 8: OBTENER CULTIVO POR ID');
  
  if (!cropId) {
    log.warning('No hay cropId disponible, saltando test');
    return false;
  }

  const result = await request('GET', `/crops/${cropId}`, null, adminToken);
  
  if (result.success) {
    log.success(`Cultivo obtenido correctamente`);
    log.info(`Nombre: ${result.data.data.name}`);
    log.info(`Estado: ${result.data.data.status}`);
    return true;
  } else {
    log.error(`Obtener cultivo falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Actualizar Cultivo
 */
const testUpdateCrop = async () => {
  log.section('TEST 9: ACTUALIZAR CULTIVO');
  
  if (!cropId) {
    log.warning('No hay cropId disponible, saltando test');
    return false;
  }

  const updateData = {
    status: 'growing',
    notes: 'Cultivo actualizado - en crecimiento'
  };

  const result = await request('PUT', `/crops/${cropId}`, updateData, adminToken);
  
  if (result.success) {
    log.success(`Cultivo actualizado correctamente`);
    log.info(`Nuevo estado: ${result.data.data.status}`);
    return true;
  } else {
    log.error(`Actualizar cultivo falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Estadísticas de Cultivos
 */
const testCropStats = async () => {
  log.section('TEST 10: ESTADÍSTICAS DE CULTIVOS');
  
  const result = await request('GET', '/crops/stats', null, adminToken);
  
  if (result.success) {
    log.success(`Estadísticas obtenidas correctamente`);
    log.info(`Total: ${result.data.data.total}`);
    return true;
  } else {
    log.error(`Obtener estadísticas falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Crear Sensor
 */
const testCreateSensor = async () => {
  log.section('TEST 11: CREAR SENSOR');
  
  const sensorData = {
    sensor_id: `SENSOR_TEST_${Date.now()}`,
    name: 'Sensor Multifunción Test',
    type: 'multi',
    field: 'Campo Norte',
    latitude: 4.6097,
    longitude: -74.0817,
    crop_id: cropId,
    status: 'active',
    reading_interval: 300
  };

  const result = await request('POST', '/sensors', sensorData, adminToken);
  
  if (result.success) {
    sensorId = result.data.data.id;
    log.success(`Sensor creado correctamente`);
    log.info(`ID: ${sensorId}`);
    log.info(`Sensor ID: ${result.data.data.sensor_id}`);
    return true;
  } else {
    log.error(`Crear sensor falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Listar Sensores
 */
const testGetSensors = async () => {
  log.section('TEST 12: LISTAR SENSORES');
  
  const result = await request('GET', '/sensors', null, adminToken);
  
  if (result.success) {
    log.success(`Sensores listados correctamente`);
    log.info(`Total de sensores: ${result.data.total}`);
    return true;
  } else {
    log.error(`Listar sensores falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Enviar Datos de Sensor
 */
const testSendSensorData = async () => {
  log.section('TEST 13: ENVIAR DATOS DE SENSOR');
  
  if (!sensorId) {
    log.warning('No hay sensorId disponible, saltando test');
    return false;
  }

  const sensorData = {
    temperature: 25.5,
    humidity: 65.0,
    soil_moisture: 45.0,
    light: 850.0,
    ph: 6.5
  };

  const result = await request('POST', `/sensors/${sensorId}/data`, sensorData);
  
  if (result.success) {
    log.success(`Datos de sensor enviados correctamente`);
    log.info(`Temperatura: ${sensorData.temperature}°C`);
    log.info(`Humedad: ${sensorData.humidity}%`);
    return true;
  } else {
    log.error(`Enviar datos falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Obtener Lecturas de Sensor
 */
const testGetSensorReadings = async () => {
  log.section('TEST 14: OBTENER LECTURAS DE SENSOR');
  
  if (!sensorId) {
    log.warning('No hay sensorId disponible, saltando test');
    return false;
  }

  const result = await request('GET', `/sensors/${sensorId}/readings`, null, adminToken);
  
  if (result.success) {
    log.success(`Lecturas obtenidas correctamente`);
    log.info(`Total de lecturas: ${result.data.total}`);
    return true;
  } else {
    log.error(`Obtener lecturas falló: ${result.error}`);
    return false;
  }
};

/**
 * Test de Autenticación Fallida
 */
const testAuthFailures = async () => {
  log.section('TEST 15: PRUEBAS DE AUTENTICACIÓN FALLIDA');
  
  // Test 1: Login con credenciales incorrectas
  const result1 = await request('POST', '/auth/login', {
    email: 'noexiste@example.com',
    password: 'wrongpassword'
  });
  
  if (!result1.success && result1.status === 401) {
    log.success('Login con credenciales incorrectas rechazado correctamente');
  } else {
    log.error('Validación de credenciales incorrectas falló');
  }

  // Test 2: Acceso sin token
  const result2 = await request('GET', '/crops');
  
  if (!result2.success && result2.status === 401) {
    log.success('Acceso sin token rechazado correctamente');
  } else {
    log.error('Validación de token ausente falló');
  }

  // Test 3: Token inválido
  const result3 = await request('GET', '/crops', null, 'token_invalido');
  
  if (!result3.success && result3.status === 401) {
    log.success('Token inválido rechazado correctamente');
  } else {
    log.error('Validación de token inválido falló');
  }

  return true;
};

/**
 * Test de Validaciones
 */
const testValidations = async () => {
  log.section('TEST 16: PRUEBAS DE VALIDACIÓN');
  
  // Test 1: Registro sin datos requeridos
  const result1 = await request('POST', '/auth/register', {
    name: 'Test'
    // Falta email y password
  });
  
  if (!result1.success && result1.status === 400) {
    log.success('Validación de campos requeridos funciona');
  } else {
    log.error('Validación de campos requeridos falló');
  }

  // Test 2: Email inválido
  const result2 = await request('POST', '/auth/register', {
    name: 'Test',
    email: 'email_invalido',
    password: '123456'
  });
  
  if (!result2.success && result2.status === 400) {
    log.success('Validación de email inválido funciona');
  } else {
    log.error('Validación de email inválido falló');
  }

  return true;
};

/**
 * Resumen de Tests
 */
const printSummary = (results) => {
  log.section('RESUMEN DE TESTS');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  console.log(`\nTotal de tests: ${total}`);
  console.log(`${colors.green}Pasados: ${passed}${colors.reset}`);
  console.log(`${colors.red}Fallidos: ${failed}${colors.reset}`);
  console.log(`Porcentaje de éxito: ${((passed/total)*100).toFixed(2)}%\n`);
  
  if (failed > 0) {
    console.log(`${colors.red}Tests fallidos:${colors.reset}`);
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}`);
    });
  }
};

/**
 * Ejecutar todos los tests
 */
const runAllTests = async () => {
  console.log(`${colors.cyan}
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           🧪 AGRICULTURE BACKEND - TEST SUITE 🧪              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  log.info(`Servidor: ${BASE_URL}`);
  log.info(`Fecha: ${new Date().toLocaleString()}\n`);

  const results = [];

  // Ejecutar tests en orden
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Registro de Usuario', fn: testRegister },
    { name: 'Login', fn: testLogin },
    { name: 'Obtener Usuario Actual', fn: testGetMe },
    { name: 'Listar Usuarios', fn: testGetUsers },
    { name: 'Crear Cultivo', fn: testCreateCrop },
    { name: 'Listar Cultivos', fn: testGetCrops },
    { name: 'Obtener Cultivo', fn: testGetCrop },
    { name: 'Actualizar Cultivo', fn: testUpdateCrop },
    { name: 'Estadísticas de Cultivos', fn: testCropStats },
    { name: 'Crear Sensor', fn: testCreateSensor },
    { name: 'Listar Sensores', fn: testGetSensors },
    { name: 'Enviar Datos de Sensor', fn: testSendSensorData },
    { name: 'Obtener Lecturas de Sensor', fn: testGetSensorReadings },
    { name: 'Autenticación Fallida', fn: testAuthFailures },
    { name: 'Validaciones', fn: testValidations }
  ];

  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.push({ name: test.name, passed });
      
      // Pequeña pausa entre tests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      log.error(`Error en test "${test.name}": ${error.message}`);
      results.push({ name: test.name, passed: false });
    }
  }

  // Mostrar resumen
  printSummary(results);
};

// Verificar que axios está instalado
try {
  require.resolve('axios');
} catch (e) {
  console.log(`${colors.red}Error: axios no está instalado${colors.reset}`);
  console.log(`${colors.yellow}Ejecuta: npm install axios${colors.reset}`);
  process.exit(1);
}

// Ejecutar tests
runAllTests()
  .then(() => {
    log.info('\n✅ Suite de tests completada');
    process.exit(0);
  })
  .catch((error) => {
    log.error(`\n❌ Error fatal: ${error.message}`);
    process.exit(1);
  });
