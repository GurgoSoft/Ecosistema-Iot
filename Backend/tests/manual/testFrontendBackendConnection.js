/**
 * Script de prueba: Verificar conexión Frontend-Backend
 * Prueba los endpoints de autenticación desde el frontend
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testBackendConnection() {
  console.log('🧪 Probando conexión Frontend → Backend\n');
  console.log(`📍 URL del backend: ${API_URL}\n`);

  try {
    // Test 1: Verificar que el backend responde
    console.log('✅ Test 1: Verificar que el backend está corriendo...');
    try {
      const healthCheck = await axios.get('http://localhost:5000');
      console.log('✅ Backend responde:', healthCheck.data.message);
      console.log('');
    } catch (error) {
      console.log('❌ Backend no está corriendo en http://localhost:5000');
      console.log('   Por favor ejecuta: npm run dev en la carpeta Backend\n');
      return;
    }

    // Test 2: Probar registro de usuario
    console.log('✅ Test 2: Probar registro de usuario...');
    const testUser = {
      username: `testuser_${Date.now()}`,
      firstName: 'Test',
      lastName: 'User',
      email: `test_${Date.now()}@example.com`,
      password: 'Test1234!',
      areaOfWork: 'technology',
      companyName: 'Test Company',
      companyWebsite: 'https://test.com',
      phone: '+1234567890'
    };

    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
      console.log('✅ Registro exitoso');
      console.log('   Usuario:', registerResponse.data.data.user.username);
      console.log('   Token recibido:', registerResponse.data.data.token ? '✅' : '❌');
      console.log('');

      // Test 3: Probar login con el usuario creado
      console.log('✅ Test 3: Probar login...');
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        username: testUser.username,
        password: testUser.password
      });
      console.log('✅ Login exitoso');
      console.log('   Usuario:', loginResponse.data.user.username);
      console.log('   Token recibido:', loginResponse.data.token ? '✅' : '❌');
      console.log('');

      // Test 4: Probar obtener usuario actual
      console.log('✅ Test 4: Probar obtener usuario actual...');
      const meResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${loginResponse.data.token}`
        }
      });
      console.log('✅ Usuario actual obtenido');
      console.log('   Username:', meResponse.data.username);
      console.log('   Email:', meResponse.data.email);
      console.log('');

    } catch (error) {
      if (error.response) {
        console.log('❌ Error en la prueba');
        console.log('   Status:', error.response.status);
        console.log('   Mensaje:', error.response.data.message || error.response.data);
        console.log('');
      } else {
        throw error;
      }
    }

    // Test 5: Probar login con credenciales incorrectas
    console.log('✅ Test 5: Probar login con credenciales incorrectas...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        username: 'usuarioinexistente',
        password: 'passwordincorrecto'
      });
      console.log('❌ ERROR: Debería haber rechazado credenciales incorrectas\n');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctamente rechazó credenciales inválidas');
        console.log('   Mensaje:', error.response.data.message);
        console.log('');
      } else {
        throw error;
      }
    }

    // Test 6: Probar login con campos vacíos
    console.log('✅ Test 6: Probar login con campos vacíos...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        username: '',
        password: ''
      });
      console.log('❌ ERROR: Debería haber rechazado campos vacíos\n');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Correctamente rechazó campos vacíos');
        console.log('   Mensaje:', error.response.data.message);
        console.log('');
      } else {
        throw error;
      }
    }

    console.log('🎉 ¡TODAS LAS PRUEBAS PASARON!');
    console.log('✅ El backend está funcionando correctamente');
    console.log('✅ El frontend puede conectarse sin problemas');
    console.log('');
    console.log('📌 Próximo paso:');
    console.log('   1. Asegúrate de que el backend esté corriendo: npm run dev');
    console.log('   2. Asegúrate de que el frontend esté corriendo: npm run dev');
    console.log('   3. Abre el navegador en http://localhost:5173');
    console.log('   4. Prueba el login y registro desde la interfaz');

  } catch (error) {
    console.error('\n❌ Error inesperado:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   El backend no está corriendo. Ejecuta: npm run dev en Backend/');
    }
  }
}

// Ejecutar prueba
testBackendConnection();
