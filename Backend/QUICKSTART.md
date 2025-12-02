# 🚀 Guía Rápida de Inicio

## Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar axios (para tests manuales)

```bash
npm install axios
```

### 3. Verificar conexión a la base de datos

```bash
node tests/manual/testConnection.js
```

Deberías ver algo como:
```
✅ Conexión exitosa!
✅ Modelos sincronizados!
📋 Tablas en la base de datos:
  - users
  - crops
  - sensors
  - sensor_readings
```

## Iniciar el Servidor

### Modo Desarrollo (con auto-reload)

```bash
npm run dev
```

### Modo Producción

```bash
npm start
```

El servidor iniciará en: `http://localhost:5000`

## Verificar que el Servidor Funciona

Abre tu navegador o usa curl:

```bash
curl http://localhost:5000/api/health
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Ejecutar Tests

### Test Rápido de Todos los Endpoints

Con el servidor corriendo, ejecuta en otra terminal:

```bash
npm run test:routes
```

Esto probará:
- ✅ Registro de usuarios
- ✅ Login
- ✅ CRUD de cultivos
- ✅ CRUD de sensores
- ✅ Envío de datos IoT
- ✅ Y mucho más...

### Tests Unitarios

```bash
npm test
```

## Primeros Pasos con la API

### 1. Registrar un Usuario

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

Guarda el `token` de la respuesta.

### 2. Crear un Cultivo

```bash
curl -X POST http://localhost:5000/api/crops \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Maíz Campo 1",
    "type": "cereal",
    "field": "Campo Norte",
    "area": 10.5,
    "planting_date": "2024-01-15",
    "expected_harvest_date": "2024-06-15"
  }'
```

### 3. Crear un Sensor

```bash
curl -X POST http://localhost:5000/api/sensors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "sensor_id": "SENSOR_001",
    "name": "Sensor Multifunción",
    "type": "multi",
    "field": "Campo Norte",
    "status": "active"
  }'
```

### 4. Enviar Datos del Sensor

```bash
curl -X POST http://localhost:5000/api/sensors/SENSOR_ID/data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.5,
    "humidity": 65,
    "soil_moisture": 45,
    "light": 850,
    "ph": 6.5
  }'
```

## Estructura de Carpetas

```
src/
├── config/          # Configuración de BD y variables
├── models/          # Modelos de Sequelize
├── controllers/     # Lógica de negocio
├── routes/          # Definición de endpoints
├── middlewares/     # Middlewares (auth, validation, etc.)
├── app.js           # Configuración de Express
└── server.js        # Punto de entrada

tests/
├── manual/          # Tests ejecutables
├── unit/            # Tests unitarios
└── integration/     # Tests de integración
```

## Variables de Entorno

Ya están configuradas en `.env`:

```env
NODE_ENV=development
PORT=5000
DB_HOST=34.228.15.95
DB_USER=orus_test
DB_PASS=ORUS2025*
DB_NAME=orus_agriculture_db_test
JWT_SECRET=orus_agriculture_secret_key_2025
```

## Troubleshooting

### Error de conexión a PostgreSQL

1. Verifica que las credenciales en `.env` sean correctas
2. Ejecuta: `node tests/manual/testConnection.js`

### El servidor no inicia

1. Verifica que el puerto 5000 esté libre
2. Revisa los logs en la consola
3. Verifica que todas las dependencias estén instaladas: `npm install`

### Los tests fallan

1. Asegúrate de que el servidor esté corriendo: `npm run dev`
2. Verifica la conexión a BD: `node tests/manual/testConnection.js`
3. Lee los logs de error detallados

## Documentación Completa

- [README Principal](README.md) - Documentación completa
- [Tests](tests/README.md) - Guía de testing
- [API Endpoints](README.md#-api-endpoints) - Lista de todos los endpoints

## ¿Necesitas Ayuda?

Contacta al equipo de desarrollo o revisa la documentación completa en el README.md
