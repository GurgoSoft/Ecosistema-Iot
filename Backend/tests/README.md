# 🧪 Tests del Backend Agriculture

Este directorio contiene todos los tests para el backend del sistema Agriculture.

## 📁 Estructura

```
tests/
├── manual/                    # Tests manuales ejecutables
│   ├── testConnection.js     # Verificar conexión a BD
│   └── testAllRoutes.js      # Test completo de todos los endpoints
├── unit/                      # Tests unitarios
│   └── user.test.js          # Tests del modelo User
└── integration/               # Tests de integración
    └── auth.test.js          # Tests de rutas de autenticación
```

## 🚀 Cómo ejecutar los tests

### Prerequisitos

Asegúrate de tener instaladas todas las dependencias:

```bash
npm install
```

También necesitas instalar `axios` para los tests manuales:

```bash
npm install axios
```

### 1. Test de Conexión a la Base de Datos

Este test verifica que la conexión a PostgreSQL funciona correctamente:

```bash
node tests/manual/testConnection.js
```

**Qué verifica:**
- ✅ Conexión a PostgreSQL
- ✅ Sincronización de modelos
- ✅ Lista de tablas en la base de datos

### 2. Test Manual de Todas las Rutas

**IMPORTANTE:** Antes de ejecutar este test, asegúrate de que el servidor esté corriendo.

En una terminal, inicia el servidor:
```bash
npm run dev
```

En otra terminal, ejecuta el test:
```bash
npm run test:routes
```

**Qué prueba:**
- ✅ Health check
- ✅ Registro de usuarios
- ✅ Login
- ✅ Autenticación con JWT
- ✅ CRUD de usuarios
- ✅ CRUD de cultivos
- ✅ CRUD de sensores
- ✅ Envío de datos de sensores
- ✅ Lecturas de sensores
- ✅ Validaciones
- ✅ Manejo de errores

**Salida esperada:**
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           🧪 AGRICULTURE BACKEND - TEST SUITE 🧪              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

...

RESUMEN DE TESTS

Total de tests: 16
Pasados: 16
Fallidos: 0
Porcentaje de éxito: 100.00%
```

### 3. Tests Unitarios (Jest)

Ejecutar todos los tests unitarios:

```bash
npm test
```

Ejecutar tests en modo watch (desarrollo):

```bash
npm run test:watch
```

Ejecutar tests con cobertura:

```bash
npm test -- --coverage
```

## 📊 Tipos de Tests

### Tests Unitarios

Prueban unidades individuales de código (modelos, funciones):

- **user.test.js**: Tests del modelo User
  - Creación de usuarios
  - Validaciones
  - Encriptación de contraseñas
  - Métodos del modelo

### Tests de Integración

Prueban la interacción entre componentes (rutas + controladores + modelos):

- **auth.test.js**: Tests de autenticación
  - Registro
  - Login
  - Obtener usuario actual
  - Logout
  - Validación de tokens

### Tests Manuales

Scripts ejecutables para pruebas rápidas y debugging:

- **testConnection.js**: Verifica conexión a BD
- **testAllRoutes.js**: Suite completa de pruebas de API

## 🎯 Cobertura de Tests

Para ver el reporte de cobertura:

```bash
npm test -- --coverage
```

Esto generará un reporte en `coverage/` mostrando:
- % de líneas cubiertas
- % de funciones cubiertas
- % de branches cubiertas
- % de statements cubiertos

## 🐛 Debugging

### Si los tests fallan:

1. **Verifica la conexión a la base de datos:**
   ```bash
   node tests/manual/testConnection.js
   ```

2. **Verifica las variables de entorno:**
   - Asegúrate de que `.env` existe
   - Verifica las credenciales de PostgreSQL

3. **Verifica que el servidor esté corriendo:**
   ```bash
   npm run dev
   ```

4. **Revisa los logs:**
   - Los tests manuales muestran detalles de cada petición
   - Los tests de Jest muestran errores detallados

## 📝 Agregar Nuevos Tests

### Test Unitario:

Crea un archivo en `tests/unit/`:

```javascript
const Model = require('../../src/models/Model');

describe('Model Name', () => {
  test('Debe hacer algo', () => {
    // Tu test aquí
  });
});
```

### Test de Integración:

Crea un archivo en `tests/integration/`:

```javascript
const request = require('supertest');
const createApp = require('../../src/app');

describe('Route Name', () => {
  test('Debe responder correctamente', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

### Test Manual:

Agrega tu test en `tests/manual/testAllRoutes.js` o crea un nuevo archivo.

## 📞 Soporte

Si tienes problemas con los tests, contacta al equipo de desarrollo.
