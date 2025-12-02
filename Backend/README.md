# Agriculture Backend API

Backend API para sistema de agricultura inteligente con monitoreo IoT.

## 🚀 Características

- **Autenticación JWT**: Sistema seguro de autenticación y autorización
- **Gestión de Usuarios**: CRUD completo con roles (admin, operator, user)
- **Gestión de Cultivos**: Control de cultivos agrícolas con geolocalización
- **Sensores IoT**: Integración con dispositivos IoT para monitoreo en tiempo real
- **Alertas Automáticas**: Sistema de alertas basado en condiciones óptimas
- **API RESTful**: Arquitectura REST con mejores prácticas

## 📋 Prerequisitos

- Node.js >= 14.x
- PostgreSQL >= 12.x
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/ControllerORUS/AgricultureBack.git
cd AgricultureBack
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
NODE_ENV=development
PORT=5000
DB_HOST=34.228.15.95
DB_USER=orus_test
DB_PASS=ORUS2025*
DB_NAME=orus_agriculture_db_test
DB_PORT=5432
DB_DIALECT=postgres
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

4. Iniciar el servidor:
```bash
# Desarrollo con nodemon
npm run dev

# Producción
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── config/          # Configuraciones (DB, JWT, etc.)
│   ├── config.js
│   └── database.js
├── controllers/     # Controladores de rutas
│   ├── authController.js
│   ├── userController.js
│   ├── cropController.js
│   └── sensorController.js
├── middlewares/     # Middlewares personalizados
│   ├── auth.js
│   ├── errorHandler.js
│   └── validate.js
├── models/          # Modelos de Sequelize
│   ├── index.js
│   ├── User.js
│   ├── Crop.js
│   ├── Sensor.js
│   └── SensorReading.js
├── routes/          # Definición de rutas
│   ├── index.js
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── cropRoutes.js
│   └── sensorRoutes.js
├── app.js           # Configuración de Express
└── server.js        # Punto de entrada
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere auth)
- `POST /api/auth/logout` - Cerrar sesión (requiere auth)

### Usuarios
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (admin)
- `PUT /api/users/:id/password` - Cambiar contraseña

### Cultivos
- `GET /api/crops` - Listar cultivos
- `GET /api/crops/stats` - Estadísticas de cultivos
- `GET /api/crops/:id` - Obtener cultivo
- `POST /api/crops` - Crear cultivo
- `PUT /api/crops/:id` - Actualizar cultivo
- `DELETE /api/crops/:id` - Eliminar cultivo

### Sensores
- `GET /api/sensors` - Listar sensores
- `GET /api/sensors/:id` - Obtener sensor
- `POST /api/sensors` - Crear sensor (admin/operator)
- `PUT /api/sensors/:id` - Actualizar sensor (admin/operator)
- `DELETE /api/sensors/:id` - Eliminar sensor (admin)
- `POST /api/sensors/:id/data` - Enviar datos de sensor (IoT)
- `GET /api/sensors/:id/readings` - Obtener lecturas
- `GET /api/sensors/:id/readings/average` - Promedios de lecturas

## 🔐 Autenticación

Las rutas protegidas requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

### Roles
- **user**: Usuario básico, puede gestionar sus propios cultivos
- **operator**: Puede gestionar sensores
- **admin**: Acceso completo al sistema

## 📝 Ejemplos de Uso

### Registro de Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Crear Cultivo
```bash
curl -X POST http://localhost:5000/api/crops \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Maíz Lote 1",
    "type": "cereal",
    "location": {
      "field": "Campo Norte",
      "area": 5.5
    },
    "plantingDate": "2024-01-15",
    "expectedHarvestDate": "2024-06-15"
  }'
```

### Enviar Datos de Sensor (IoT)
```bash
curl -X POST http://localhost:5000/api/sensors/SENSOR_ID/data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.5,
    "humidity": 65,
    "soilMoisture": 45,
    "light": 850,
    "ph": 6.5
  }'
```

## Cómo ejecutar pruebas

### Pruebas manuales con curl o PowerShell

**Registro de usuario:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Test User","email":"testuser@example.com","password":"123456"}'
```

**Login de usuario:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"testuser@example.com","password":"123456"}'
```

### Pruebas automáticas (si tienes tests configurados)

```bash
npm test
```

Esto ejecuta la suite de tests unitarios y de integración.

### Verifica los resultados

- Revisa la respuesta en consola.
- Verifica en la base de datos con:
  ```sql
  SELECT * FROM users;
  ```

## 🧪 Testing

El proyecto incluye una suite completa de tests:

### Tests Automatizados (Jest)

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ver cobertura de código
npm test -- --coverage
```

### Tests Manuales

**1. Test de Conexión a la Base de Datos:**
```bash
node tests/manual/testConnection.js
```

**2. Test Completo de Todos los Endpoints:**

Primero, inicia el servidor en una terminal:
```bash
npm run dev
```

Luego, en otra terminal, ejecuta los tests:
```bash
npm run test:routes
```

Este test verificará:
- ✅ 16 pruebas diferentes
- ✅ Todos los endpoints de la API
- ✅ Autenticación y autorización
- ✅ Validaciones de datos
- ✅ Manejo de errores

Ver más detalles en [tests/README.md](tests/README.md)

## 📦 Scripts Disponibles

```bash
npm start           # Iniciar en producción
npm run dev         # Iniciar en desarrollo con nodemon
npm test            # Ejecutar tests unitarios y de integración
npm run test:watch  # Ejecutar tests en modo watch
npm run test:routes # Ejecutar suite completa de tests de API (requiere servidor activo)
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT para autenticación stateless
- Helmet.js para headers de seguridad HTTP
- CORS configurado
- Validación de datos con express-validator
- Protección contra ataques comunes

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

MIT License

## 👥 Autores

- Equipo de Desarrollo Agriculture System

## 📞 Soporte

Para soporte, contactar a: support@agriculture-system.com