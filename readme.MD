# 🌾 ORUS Agriculture Management System - Ecosistema IoT

Sistema completo de gestión agrícola con monitoreo IoT, análisis de datos en tiempo real y gestión de cultivos. Integra sensores, dispositivos IoT y visualización de datos con Grafana.

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [API Endpoints](#-api-endpoints)
- [Características Principales](#-características-principales)
- [Contribuir](#-contribuir)

## 🎯 Descripción General

ORUS es un sistema de gestión agrícola integral que permite:

- **Monitoreo en Tiempo Real**: Sensores IoT para temperatura, humedad, pH del suelo, etc.
- **Gestión de Cultivos**: Administración completa del ciclo de vida de los cultivos
- **Análisis de Datos**: Dashboards interactivos con Grafana para visualización de métricas
- **Gestión de Inventario**: Control de productos, insumos y recursos
- **Gestión de Personal**: Administración de empleados y asignación de tareas
- **Sistema de Alertas**: Notificaciones automáticas basadas en umbrales de sensores

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │─────▶│    Backend      │─────▶│   PostgreSQL    │
│  React + Vite   │      │  Node.js/Express│      │    Database     │
│   Port: 3000    │      │   Port: 5000    │      │   Port: 5432    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                        │                         │
         │                        │                         │
         └────────────────────────┴─────────────────────────┘
                                  │
                         ┌────────▼────────┐
                         │    Grafana      │
                         │  Visualización  │
                         └─────────────────┘
```

### Flujo de Datos

1. **Frontend** (React): Interfaz de usuario con componentes interactivos
2. **Backend** (Node.js + Express): API RESTful con autenticación JWT
3. **Base de Datos** (PostgreSQL): Almacenamiento persistente con Sequelize ORM
4. **Grafana**: Dashboards para visualización de métricas de sensores

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** v16+
- **Express.js** v4.18 - Framework web
- **Sequelize** v6.31 - ORM para PostgreSQL
- **PostgreSQL** v12+ - Base de datos relacional
- **JWT** (jsonwebtoken) - Autenticación y autorización
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Control de acceso entre dominios
- **Helmet** - Seguridad de headers HTTP
- **Morgan** - Logging de peticiones HTTP
- **dotenv** - Gestión de variables de entorno

### Frontend
- **React** v18.2 - Biblioteca UI
- **TypeScript** v5.0 - Tipado estático
- **Vite** v4.4 - Build tool y dev server
- **React Router DOM** v6.8 - Enrutamiento
- **Axios** v1.3 - Cliente HTTP
- **CSS3** - Estilos personalizados

### DevOps & Tools
- **Nodemon** - Auto-reload en desarrollo
- **ESLint** - Linting de código
- **Git** - Control de versiones

## 📁 Estructura del Proyecto

```
REPO/
│
├── Backend/                          # Servidor Node.js/Express
│   ├── src/
│   │   ├── app.js                   # Configuración de Express
│   │   ├── server.js                # Punto de entrada del servidor
│   │   │
│   │   ├── config/                  # Configuraciones
│   │   │   ├── config.js           # Configuración general
│   │   │   └── database.js         # Conexión a PostgreSQL
│   │   │
│   │   ├── controllers/             # Lógica de negocio
│   │   │   ├── auth.controller.js  # Autenticación
│   │   │   ├── crop.controller.js  # Gestión de cultivos
│   │   │   ├── sensor.controller.js # Gestión de sensores
│   │   │   ├── inventory.controller.js
│   │   │   ├── employee.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── dashboard.controller.js
│   │   │
│   │   ├── models/                  # Modelos de datos (Sequelize)
│   │   │   ├── User.js             # Usuarios
│   │   │   ├── Crop.js             # Cultivos
│   │   │   ├── Sensor.js           # Sensores IoT
│   │   │   ├── SensorReading.js    # Lecturas de sensores
│   │   │   ├── Employee.js         # Empleados
│   │   │   ├── Inventory.js        # Inventario
│   │   │   ├── Product.js          # Productos
│   │   │   ├── Task.js             # Tareas
│   │   │   └── index.js            # Exportación y asociaciones
│   │   │
│   │   ├── routes/                  # Definición de rutas
│   │   │   ├── index.js            # Router principal
│   │   │   ├── authRoutes.js       # Rutas de autenticación
│   │   │   ├── cropRoutes.js       # Rutas de cultivos
│   │   │   ├── sensorRoutes.js     # Rutas de sensores
│   │   │   ├── userRoutes.js       # Rutas de usuarios
│   │   │   ├── employeeRoutes.js
│   │   │   ├── inventoryRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   │
│   │   ├── middlewares/             # Middlewares personalizados
│   │   │   ├── auth.js             # Autenticación JWT
│   │   │   ├── errorHandler.js     # Manejo de errores
│   │   │   └── validate.js         # Validación de datos
│   │   │
│   │   └── middleware/
│   │       └── auth.middleware.js
│   │
│   ├── scripts/                     # Scripts de utilidad
│   │   ├── seed-users.js           # Poblar usuarios
│   │   └── list-users.js           # Listar usuarios
│   │
│   ├── tests/                       # Tests del backend
│   │   ├── unit/                   # Tests unitarios
│   │   ├── integration/            # Tests de integración
│   │   └── manual/                 # Scripts de prueba manual
│   │
│   ├── .env.example                # Ejemplo de variables de entorno
│   ├── package.json                # Dependencias del backend
│   └── README.md                   # Documentación del backend
│
├── Frontend/                        # Aplicación React
│   ├── src/
│   │   ├── main.tsx                # Punto de entrada
│   │   ├── App.tsx                 # Componente principal
│   │   │
│   │   ├── components/             # Componentes reutilizables
│   │   │   ├── DeviceCard.tsx     # Tarjeta de dispositivo
│   │   │   ├── GrafanaPanel.tsx   # Panel de Grafana
│   │   │   └── auth/              # Componentes de autenticación
│   │   │       ├── Login.tsx
│   │   │       ├── Register.tsx
│   │   │       └── Modal.tsx
│   │   │
│   │   ├── pages/                  # Páginas de la aplicación
│   │   │   ├── Dashboard.tsx      # Dashboard principal
│   │   │   ├── DevicesPage.tsx    # Gestión de dispositivos
│   │   │   ├── AnalyticsPage.tsx  # Análisis de datos
│   │   │   ├── AlertsPage.tsx     # Alertas del sistema
│   │   │   ├── SettingsPage.tsx   # Configuración
│   │   │   └── auth/
│   │   │       └── AuthPage.tsx   # Página de autenticación
│   │   │
│   │   ├── services/               # Servicios API
│   │   │   └── api.ts             # Cliente Axios configurado
│   │   │
│   │   ├── types/                  # Definiciones TypeScript
│   │   │   └── index.ts           # Tipos compartidos
│   │   │
│   │   ├── App.css                # Estilos de App
│   │   └── index.css              # Estilos globales
│   │
│   ├── public/                     # Archivos estáticos
│   ├── .env.example               # Ejemplo de variables de entorno
│   ├── index.html                 # HTML base
│   ├── package.json               # Dependencias del frontend
│   ├── tsconfig.json              # Configuración TypeScript
│   ├── vite.config.ts             # Configuración Vite
│   └── README.md                  # Documentación del frontend
│
└── readme.MD                       # Este archivo (documentación general)
```

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v16 o superior ([Descargar aquí](https://nodejs.org/))
- **npm** v7 o superior (incluido con Node.js)
- **PostgreSQL** v12 o superior ([Descargar aquí](https://www.postgresql.org/download/))
- **Git** ([Descargar aquí](https://git-scm.com/))

Para verificar las instalaciones:

```powershell
node --version
npm --version
psql --version
git --version
```

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```powershell
git clone https://github.com/GurgoSoft/Ecosistema-Iot.git
cd Ecosistema-Iot
```

### 2. Configuración del Backend

#### 2.1 Instalar Dependencias

```powershell
cd Backend
npm install
```

#### 2.2 Configurar Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```powershell
Copy-Item .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Configuración del Servidor
NODE_ENV=development
PORT=5000

# Configuración de la Base de Datos PostgreSQL
DB_HOST=34.228.15.95
DB_USER=orus_test
DB_PASS=ORUS2025*
DB_NAME=orus_agriculture_db_test
DB_PORT=5432
DB_DIALECT=postgres

# Configuración de JWT
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRE=7d

# Configuración de CORS (separar múltiples orígenes con comas)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Configuración de Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 2.3 Iniciar el Servidor Backend

```powershell
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:5000`

### 3. Configuración del Frontend

#### 3.1 Instalar Dependencias

```powershell
cd ..\Frontend
npm install
```

#### 3.2 Configurar Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```powershell
Copy-Item .env.example .env
```

Edita el archivo `.env`:

```env
# URL de la API Backend
VITE_API_URL=http://localhost:5000/api

# Otras configuraciones del frontend
VITE_APP_NAME=ORUS Agriculture Management System
```

#### 3.3 Iniciar el Servidor de Desarrollo

```powershell
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

### 4. Verificar la Conexión

1. Abre tu navegador en `http://localhost:3000`
2. Deberías ver la página de autenticación
3. El backend debe estar respondiendo en `http://localhost:5000/api/health`

## 💻 Uso del Sistema

### Registro e Inicio de Sesión

1. **Registrar Usuario Nuevo**:
   - Navega a la página de registro
   - Completa el formulario con: username, email, password
   - Haz clic en "Registrar"

2. **Iniciar Sesión**:
   - Ingresa tus credenciales (username/email y password)
   - El token JWT se guardará automáticamente en localStorage
   - Serás redirigido al dashboard principal

### Funcionalidades Principales

#### Dashboard
- Vista general de métricas clave
- Gráficos de sensores en tiempo real
- Resumen de cultivos activos
- Alertas recientes

#### Gestión de Cultivos
- Crear nuevos cultivos
- Actualizar información de cultivos existentes
- Eliminar cultivos
- Ver estadísticas por cultivo

#### Monitoreo de Sensores
- Ver lecturas de sensores en tiempo real
- Configurar umbrales de alertas
- Visualizar histórico de datos
- Integración con Grafana

#### Gestión de Inventario
- Control de productos e insumos
- Registro de entradas y salidas
- Alertas de stock bajo

#### Gestión de Personal
- Administrar empleados
- Asignar tareas
- Seguimiento de actividades

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/me` | Obtener usuario actual | Sí |
| POST | `/api/auth/logout` | Cerrar sesión | Sí |

### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Listar todos los usuarios | Sí |
| GET | `/api/users/:id` | Obtener usuario por ID | Sí |
| PUT | `/api/users/:id` | Actualizar usuario | Sí |
| DELETE | `/api/users/:id` | Eliminar usuario | Sí |

### Cultivos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/crops` | Listar todos los cultivos | Sí |
| GET | `/api/crops/:id` | Obtener cultivo por ID | Sí |
| POST | `/api/crops` | Crear nuevo cultivo | Sí |
| PUT | `/api/crops/:id` | Actualizar cultivo | Sí |
| DELETE | `/api/crops/:id` | Eliminar cultivo | Sí |
| GET | `/api/crops/stats` | Estadísticas de cultivos | Sí |

### Sensores

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/sensors` | Listar todos los sensores | Sí |
| GET | `/api/sensors/:id` | Obtener sensor por ID | Sí |
| POST | `/api/sensors` | Crear nuevo sensor | Sí |
| PUT | `/api/sensors/:id` | Actualizar sensor | Sí |
| DELETE | `/api/sensors/:id` | Eliminar sensor | Sí |
| GET | `/api/sensors/:id/readings` | Obtener lecturas de sensor | Sí |
| POST | `/api/sensors/:id/readings` | Registrar nueva lectura | Sí |

### Dashboard

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/stats` | Obtener estadísticas generales | Sí |

### Health Check

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Verificar estado del servidor | No |

## ✨ Características Principales

### Seguridad
- ✅ Autenticación JWT con tokens seguros
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Headers de seguridad con Helmet
- ✅ Protección CORS configurada
- ✅ Rate limiting para prevenir ataques
- ✅ Validación de datos de entrada

### Rendimiento
- ✅ Compresión de respuestas HTTP
- ✅ Connection pooling en PostgreSQL
- ✅ Logging de peticiones con Morgan
- ✅ Manejo optimizado de errores

### Escalabilidad
- ✅ Arquitectura modular
- ✅ Separación de responsabilidades
- ✅ ORM Sequelize para abstracción de BD
- ✅ Configuración basada en variables de entorno

### Monitoreo
- ✅ Integración con Grafana
- ✅ Dashboards personalizables
- ✅ Alertas automáticas
- ✅ Histórico de datos de sensores

## 🧪 Testing

### Backend Tests

```powershell
cd Backend

# Ejecutar todos los tests
npm test

# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration
```

### Scripts de Prueba Manual

```powershell
# Listar usuarios en la base de datos
node scripts/list-users.js

# Poblar base de datos con usuarios de prueba
node scripts/seed-users.js

# Probar todas las rutas
node tests/manual/testAllRoutes.js

# Verificar conexión a la base de datos
node tests/manual/testConnection.js

# Ver datos de la base de datos
node tests/manual/viewDatabaseData.js
```

## 📚 Documentación Adicional

- [Documentación del Backend](./Backend/README.md)
- [Guía de Inicio Rápido del Backend](./Backend/QUICKSTART.md)
- [Documentación del Frontend](./Frontend/README.md)
- [Tests del Backend](./Backend/tests/README.md)

## 🔧 Troubleshooting

### Problema: Error de conexión a la base de datos

**Solución**: Verifica que PostgreSQL esté ejecutándose y que las credenciales en `.env` sean correctas.

```powershell
# Verificar servicio de PostgreSQL
Get-Service postgresql*
```

### Problema: Puerto ya en uso

**Solución**: Cambia el puerto en el archivo `.env` o mata el proceso que está usando el puerto.

```powershell
# Ver qué proceso usa el puerto 5000
netstat -ano | findstr :5000

# Matar proceso (reemplaza PID con el número del proceso)
taskkill /PID <PID> /F
```

### Problema: Error de CORS

**Solución**: Asegúrate de que el origen del frontend esté incluido en `CORS_ORIGIN` en el `.env` del backend.

### Problema: Token JWT inválido

**Solución**: Limpia el localStorage del navegador o cierra sesión y vuelve a iniciar.

```javascript
// En la consola del navegador
localStorage.clear();
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 👥 Autores

- **GurgoSoft** - [GitHub](https://github.com/GurgoSoft)

## 🙏 Agradecimientos

- Equipo de desarrollo de ORUS
- Comunidad de Node.js y React
- Contribuidores del proyecto

---

**Nota**: Este proyecto está en desarrollo activo. Las características y la documentación pueden cambiar.

Para más información o soporte, por favor abre un issue en el repositorio de GitHub.
