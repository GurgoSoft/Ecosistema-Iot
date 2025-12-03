/**
 * Script de Prueba: Verificar Endpoints de Autenticación
 * Prueba todos los endpoints con validaciones estrictas
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';
let authToken = null;
let testUserId = null;

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, emoji, message) {
  console.log(`${color}${emoji} ${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${'='.repeat(70)}`);
  log(colors.cyan, '📋', title);
  console.log('='.repeat(70));
}

function logTest(description) {
  console.log(`\n${colors.blue}🧪 Test: ${description}${colors.reset}`);
}

function logSuccess(message) {
  log(colors.green, '✅', message);
}

function logError(message) {
  log(colors.red, '❌', message);
}

function logWarning(message) {
  log(colors.yellow, '⚠️ ', message);
}

// Generar username único para las pruebas
const timestamp = Date.now();
const testUsername = `testuser${timestamp}`;
const testEmail = `test${timestamp}@example.com`;

// ============================================================================
// PRUEBAS DE REGISTRO
// ============================================================================

async function testRegisterWithValidData() {
  logTest('Register con datos válidos');
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username: testUsername,
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      password: 'Test1234!',
      areaOfWork: 'technology',
      companyName: 'Test Corp',
      companyWebsite: 'https://test.com',
      phone: '+1234567890'
    });

    if (response.data.data && response.data.data.token) {
      authToken = response.data.data.token;
      testUserId = response.data.data.user.id;
      logSuccess('Registro exitoso');
      console.log('   Token recibido:', authToken.substring(0, 20) + '...');
      console.log('   User ID:', testUserId);
      return true;
    } else {
      logError('Respuesta no tiene el formato esperado');
      return false;
    }
  } catch (error) {
    logError(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testRegisterWithEmptyUsername() {
  logTest('Register con username vacío (debe fallar)');
  try {
    await axios.post(`${API_BASE_URL}/auth/register`, {
      username: '',
      firstName: 'Test',
      lastName: 'User',
      email: 'test2@example.com',
      password: 'Test1234!',
      areaOfWork: 'technology',
      companyName: 'Test Corp',
      companyWebsite: 'https://test.com'
    });
    logError('No debería permitir username vacío');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logSuccess('Correctamente rechazado: ' + error.response.data.message);
      return true;
    }
    logError('Error inesperado: ' + error.message);
    return false;
  }
}

async function testRegisterWithShortPassword() {
  logTest('Register con password corto (debe fallar)');
  try {
    await axios.post(`${API_BASE_URL}/auth/register`, {
      username: 'testuser2',
      firstName: 'Test',
      lastName: 'User',
      email: 'test3@example.com',
      password: 'Test12',
      areaOfWork: 'technology',
      companyName: 'Test Corp',
      companyWebsite: 'https://test.com'
    });
    logError('No debería permitir password menor a 8 caracteres');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logSuccess('Correctamente rechazado: ' + error.response.data.message);
      return true;
    }
    logError('Error inesperado: ' + error.message);
    return false;
  }
}

async function testRegisterWithoutSpecialChar() {
  logTest('Register sin carácter especial en password (debe fallar)');
  try {
    await axios.post(`${API_BASE_URL}/auth/register`, {
      username: 'testuser3',
      firstName: 'Test',
      lastName: 'User',
      email: 'test4@example.com',
      password: 'Test12345',
      areaOfWork: 'technology',
      companyName: 'Test Corp',
      companyWebsite: 'https://test.com'
    });
    logError('No debería permitir password sin carácter especial');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logSuccess('Correctamente rechazado: ' + error.response.data.message);
      return true;
    }
    logError('Error inesperado: ' + error.message);
    return false;
  }
}

async function testRegisterWithUsernameSpaces() {
  logTest('Register con espacios en username (debe fallar)');
  try {
    await axios.post(`${API_BASE_URL}/auth/register`, {
      username: 'test user',
      firstName: 'Test',
      lastName: 'User',
      email: 'test5@example.com',
      password: 'Test1234!',
      areaOfWork: 'technology',
      companyName: 'Test Corp',
      companyWebsite: 'https://test.com'
    });
    logError('No debería permitir espacios en username');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logSuccess('Correctamente rechazado: ' + error.response.data.message);
      return true;
    }
    logError('Error inesperado: ' + error.message);
    return false;
  }
}

async function testRegisterDuplicateUsername() {
  logTest('Register con username duplicado (debe fallar)');
  try {
    await axios.post(`${API_BASE_URL}/auth/register`, {
      username: testUsername,
      firstName: 'Test',
      lastName: 'User',
      email: 'different@example.com',
      password: 'Test1234!',
      areaOfWork: 'technology',
      companyName: 'Test Corp',
      companyWebsite: 'https://test.com'
    });
    logError('No debería permitir username duplicado');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logSuccess('Correctamente rechazado: ' + error.response.data.message);
      return true;
    }
    logError('Error inesperado: ' + error.message);
    return false;
  }
}

// ============================================================================
// PRUEBAS DE LOGIN
// ============================================================================

async function testLoginWithValidCredentials() {
  logTest('Login con credenciales válidas');
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: testUsername,
      password: 'Test1234!'
    });

    if (response.data.user && response.data.token) {
      logSuccess('Login exitoso');
      console.log('   Username:', response.data.user.username);
      console.log('   Email:', response.data.user.email);
      console.log('   Role:', response.data.user.role);
      return true;
    } else {
      logError('Respuesta no tiene el formato esperado');
      return false;
    }
  } catch (error) {
    logError(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testLoginWithEmptyUsername() {
  logTest('Login con username vacío (debe fallar)');
  try {
    await axios.post(`${API_BASE_URL}/auth/login`, {
      username: '',
      password: 'Test1234!'
    });
    logError('No debería permitir username vacío');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logSuccess('Correctamente rechazado: ' + error.response.data.message);
      return true;
    }
    logError('Error inesperado: ' + error.message);
    return false;
  }
}

async function testLoginWithEmptyPassword() {
  logTest('Login con password vacío (debe fallar)');
  try {
    await axios.post(`${API_BASE_URL}/auth/login`, {
      username: testUsername,
      password: ''
    });
    logError('No debería permitir password vacío');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logSuccess('Correctamente rechazado: ' + error.response.data.message);
      return true;
    }
    logError('Error inesperado: ' + error.message);
    return false;
  }
}

async function testLoginWithWrongPassword() {
  logTest('Login con password incorrecta (debe fallar)');
  try {
    await axios.post(`${API_BASE_URL}/auth/login`, {
      username: testUsername,
      password: 'WrongPassword123!'
    });
    logError('No debería permitir password incorrecta');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('Correctamente rechazado: ' + error.response.data.message);
      return true;
    }
    logError('Error inesperado: ' + error.message);
    return false;
  }
}

async function testLoginWithNonExistentUser() {
  logTest('Login con usuario inexistente (debe fallar)');
  try {
    await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'nonexistentuser999',
      password: 'Test1234!'
    });
    logError('No debería permitir usuario inexistente');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('Correctamente rechazado: ' + error.response.data.message);
      return true;
    }
    logError('Error inesperado: ' + error.message);
    return false;
  }
}

// ============================================================================
// PRUEBAS DE GET ME
// ============================================================================

async function testGetMeWithValidToken() {
  logTest('Get Me con token válido');
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (response.data.username && response.data.email) {
      logSuccess('Usuario obtenido exitosamente');
      console.log('   Username:', response.data.username);
      console.log('   Email:', response.data.email);
      console.log('   Role:', response.data.role);
      return true;
    } else {
      logError('Respuesta no tiene el formato esperado');
      return false;
    }
  } catch (error) {
    logError(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testGetMeWithoutToken() {
  logTest('Get Me sin token (debe fallar)');
  try {
    await axios.get(`${API_BASE_URL}/auth/me`);
    logError('No debería permitir acceso sin token');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('Correctamente rechazado: ' + error.response.data.message);
      return true;
    }
    logError('Error inesperado: ' + error.message);
    return false;
  }
}

async function testGetMeWithInvalidToken() {
  logTest('Get Me con token inválido (debe fallar)');
  try {
    await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: 'Bearer invalid_token_12345'
      }
    });
    logError('No debería permitir token inválido');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('Correctamente rechazado: ' + error.response.data.message);
      return true;
    }
    logError('Error inesperado: ' + error.message);
    return false;
  }
}

// ============================================================================
// EJECUTAR TODAS LAS PRUEBAS
// ============================================================================

async function runAllTests() {
  console.log('\n');
  log(colors.cyan, '🚀', 'INICIANDO PRUEBAS DE AUTENTICACIÓN');
  log(colors.cyan, '🔗', `API Base URL: ${API_BASE_URL}`);
  console.log('\n');

  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  const tests = [
    // Pruebas de Registro
    { section: 'REGISTRO', tests: [
      { name: 'Registro con datos válidos', fn: testRegisterWithValidData },
      { name: 'Registro con username vacío', fn: testRegisterWithEmptyUsername },
      { name: 'Registro con password corto', fn: testRegisterWithShortPassword },
      { name: 'Registro sin carácter especial', fn: testRegisterWithoutSpecialChar },
      { name: 'Registro con espacios en username', fn: testRegisterWithUsernameSpaces },
      { name: 'Registro con username duplicado', fn: testRegisterDuplicateUsername },
    ]},
    
    // Pruebas de Login
    { section: 'LOGIN', tests: [
      { name: 'Login con credenciales válidas', fn: testLoginWithValidCredentials },
      { name: 'Login con username vacío', fn: testLoginWithEmptyUsername },
      { name: 'Login con password vacío', fn: testLoginWithEmptyPassword },
      { name: 'Login con password incorrecta', fn: testLoginWithWrongPassword },
      { name: 'Login con usuario inexistente', fn: testLoginWithNonExistentUser },
    ]},
    
    // Pruebas de Get Me
    { section: 'GET ME', tests: [
      { name: 'Get Me con token válido', fn: testGetMeWithValidToken },
      { name: 'Get Me sin token', fn: testGetMeWithoutToken },
      { name: 'Get Me con token inválido', fn: testGetMeWithInvalidToken },
    ]}
  ];

  for (const group of tests) {
    logSection(group.section);
    
    for (const test of group.tests) {
      results.total++;
      const passed = await test.fn();
      if (passed) {
        results.passed++;
      } else {
        results.failed++;
      }
    }
  }

  // Resumen final
  logSection('RESUMEN DE PRUEBAS');
  console.log(`\nTotal de pruebas: ${results.total}`);
  logSuccess(`Pruebas exitosas: ${results.passed}`);
  if (results.failed > 0) {
    logError(`Pruebas fallidas: ${results.failed}`);
  }

  const percentage = ((results.passed / results.total) * 100).toFixed(2);
  console.log(`\nPorcentaje de éxito: ${percentage}%`);

  if (results.failed === 0) {
    console.log('\n');
    log(colors.green, '🎉', '¡TODAS LAS PRUEBAS PASARON!');
    log(colors.green, '✅', 'El backend está 100% funcional y compatible con el frontend');
  } else {
    console.log('\n');
    logWarning('Algunas pruebas fallaron. Revisa los errores arriba.');
  }

  console.log('\n');
}

// Verificar que el servidor esté corriendo
async function checkServerConnection() {
  try {
    await axios.get(`${API_BASE_URL.replace('/api', '')}/`);
    logSuccess('Conexión con el servidor exitosa');
    return true;
  } catch (error) {
    logError('No se puede conectar con el servidor');
    logWarning('Asegúrate de que el backend esté corriendo en http://localhost:5000');
    return false;
  }
}

// Punto de entrada
(async () => {
  const connected = await checkServerConnection();
  if (connected) {
    await runAllTests();
  }
})();
