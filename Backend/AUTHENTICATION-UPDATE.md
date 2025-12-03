# 🔐 Actualización del Sistema de Autenticación - Backend

## 📋 Resumen de Cambios

Este documento describe las modificaciones realizadas en el backend para que sea **100% compatible** con el frontend existente, con **validaciones estrictas (10/10)** que no permiten:

- ❌ Campos vacíos o nulos
- ❌ Credenciales inválidas
- ❌ Usuarios inexistentes
- ❌ Tokens inválidos o expirados
- ❌ Usuarios inactivos

## 🎯 Archivos Modificados

### 1. **Modelo de Usuario** (`src/models/User.js`)
- ✅ Agregado campo `username` (obligatorio, único, sin espacios)
- ✅ Reemplazado `name` por `firstName` y `lastName`
- ✅ Agregados campos institucionales:
  - `areaOfWork` (technology, manufacturing, healthcare, etc.)
  - `companyName`
  - `companyWebsite`
- ✅ Validaciones estrictas en todos los campos
- ✅ Password mínimo 8 caracteres con carácter especial obligatorio
- ✅ Role actualizado: `user`, `admin`, `viewer`

### 2. **Controlador de Autenticación** (`src/controllers/authController.js`)

#### **Login**
- ✅ Ahora acepta `username` (NO email)
- ✅ Validación estricta: no permite username/password vacíos
- ✅ Verifica que usuario existe en BD
- ✅ Verifica que usuario está activo
- ✅ Verifica contraseña correcta
- ✅ Respuesta exacta que frontend espera: `{ user, token }`

#### **Register**
- ✅ Acepta todos los campos del frontend:
  - `username`, `firstName`, `lastName`
  - `email`, `password`
  - `areaOfWork`, `companyName`, `companyWebsite`
  - `phone` (opcional)
- ✅ Validaciones estrictas de TODOS los campos
- ✅ Verifica username único
- ✅ Verifica email único
- ✅ Valida formato de email
- ✅ Valida password (8+ caracteres, carácter especial)
- ✅ Respuesta con `user` y `token`

#### **GetMe**
- ✅ Validación estricta de token
- ✅ Retorna estructura correcta del usuario

### 3. **Rutas de Autenticación** (`src/routes/authRoutes.js`)
- ✅ Validaciones con `express-validator` en todas las rutas
- ✅ Login valida `username` y `password` (no email)
- ✅ Register valida TODOS los campos obligatorios
- ✅ Validación de formato de URL para `companyWebsite`
- ✅ Validación de opciones válidas para `areaOfWork`

### 4. **Middleware de Autenticación** (`src/middlewares/auth.js`)
- ✅ Validación estricta del token Bearer
- ✅ Verifica formato correcto del header
- ✅ Maneja tokens expirados correctamente
- ✅ Maneja tokens inválidos
- ✅ Verifica que usuario existe y está activo
- ✅ Mensajes de error claros y específicos

## 🗄️ Migración de Base de Datos

### Opción 1: Script Node.js (Recomendado)

```powershell
# Ejecutar desde la carpeta Backend
node scripts/migrate-users-table.js
```

Este script:
- Agrega las nuevas columnas necesarias
- Migra datos existentes (si los hay)
- Establece restricciones y validaciones
- Muestra un reporte de la estructura final

### Opción 2: SQL Manual

```powershell
# Conectar a la base de datos y ejecutar
psql -h 34.228.15.95 -U orus_test -d orus_agriculture_db_test -f scripts/migrate-users-table.sql
```

### ⚠️ IMPORTANTE: Antes de Migrar

1. **Hacer backup de la base de datos**:
```powershell
pg_dump -h 34.228.15.95 -U orus_test -d orus_agriculture_db_test > backup_users_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

2. **Verificar conexión a la base de datos**:
```powershell
node tests/manual/testConnection.js
```

## 🚀 Cómo Probar

### 1. Iniciar el Backend

```powershell
cd Backend
npm install  # Si es la primera vez
npm run dev  # Modo desarrollo con nodemon
```

El backend correrá en: `http://localhost:5000`

### 2. Probar Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "username": "johndoe",
  "password": "Password123!"
}
```

**Response exitosa:**
```json
{
  "user": {
    "id": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

**Errores posibles:**
- `400`: Username o password vacíos
- `401`: Credenciales inválidas
- `401`: Usuario inactivo

### 3. Probar Register

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "areaOfWork": "technology",
  "companyName": "ACME Corp",
  "companyWebsite": "https://acme.com",
  "phone": "+1234567890"
}
```

**Response exitosa:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid-here",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt-token-here"
  }
}
```

**Errores posibles:**
- `400`: Campos obligatorios faltantes o vacíos
- `400`: Username con espacios
- `400`: Email inválido
- `400`: Password menor a 8 caracteres
- `400`: Password sin carácter especial
- `400`: Username ya registrado
- `400`: Email ya registrado

### 4. Probar GetMe (Usuario Actual)

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response exitosa:**
```json
{
  "id": "uuid-here",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2025-12-02T..."
}
```

**Errores posibles:**
- `401`: Token no proporcionado
- `401`: Token inválido
- `401`: Token expirado
- `401`: Usuario inactivo

## ✅ Validaciones Implementadas (10/10)

### Login
- [x] Username obligatorio y no vacío
- [x] Password obligatorio y no vacío
- [x] Usuario debe existir en base de datos
- [x] Password debe coincidir
- [x] Usuario debe estar activo

### Register
- [x] Username obligatorio, único, sin espacios (3-50 caracteres)
- [x] FirstName obligatorio (1-50 caracteres)
- [x] LastName obligatorio (1-50 caracteres)
- [x] Email obligatorio, formato válido, único
- [x] Password obligatorio, mínimo 8 caracteres, carácter especial
- [x] AreaOfWork obligatorio, valor válido del enum
- [x] CompanyName obligatorio (1-100 caracteres)
- [x] CompanyWebsite obligatorio, formato URL válido
- [x] Phone opcional

### Middleware de Autenticación
- [x] Header Authorization obligatorio
- [x] Formato Bearer correcto
- [x] Token no vacío
- [x] Token válido (no expirado, firma correcta)
- [x] Usuario existe en base de datos
- [x] Usuario activo

## 🔄 Compatibilidad con Frontend

| Aspecto | Frontend Espera | Backend Proporciona | ✅ |
|---------|----------------|---------------------|---|
| Login - Request | `{ username, password }` | Acepta `{ username, password }` | ✅ |
| Login - Response | `{ user, token }` | Retorna `{ user, token }` | ✅ |
| Register - Request | Todos los campos del form | Acepta y valida todos | ✅ |
| Register - Response | `{ user, token }` | Retorna `{ user, token }` | ✅ |
| GetMe - Response | `User` object | Retorna estructura correcta | ✅ |
| Token Format | `Bearer <token>` | Valida formato Bearer | ✅ |
| Error Messages | Mensajes claros | Mensajes descriptivos | ✅ |

## 🧪 Testing

### Prueba Manual Completa

```powershell
# Desde Backend/tests/manual
node testAllRoutes.js
```

### Con Postman/Thunder Client

Importar esta colección:

**1. Register User**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "Test1234!",
  "areaOfWork": "technology",
  "companyName": "Test Corp",
  "companyWebsite": "https://test.com"
}
```

**2. Login**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test1234!"
}
```

**3. Get Current User**
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token-from-login>
```

## 📊 Estructura de la Base de Datos

### Tabla: `users`

| Campo | Tipo | Obligatorio | Único | Descripción |
|-------|------|-------------|-------|-------------|
| id | UUID | ✅ | ✅ | ID único del usuario |
| username | VARCHAR(50) | ✅ | ✅ | Nombre de usuario (sin espacios) |
| first_name | VARCHAR(50) | ✅ | - | Nombre |
| last_name | VARCHAR(50) | ✅ | - | Apellido |
| email | VARCHAR(100) | ✅ | ✅ | Correo electrónico |
| password | VARCHAR(255) | ✅ | - | Contraseña encriptada |
| area_of_work | VARCHAR(50) | ✅ | - | Área de trabajo |
| company_name | VARCHAR(100) | ✅ | - | Nombre de la compañía |
| company_website | VARCHAR(255) | ✅ | - | Sitio web de la compañía |
| phone | VARCHAR(20) | - | - | Teléfono (opcional) |
| role | ENUM | ✅ | - | user, admin, viewer |
| is_active | BOOLEAN | ✅ | - | Estado del usuario |
| last_login | TIMESTAMP | - | - | Último inicio de sesión |
| created_at | TIMESTAMP | ✅ | - | Fecha de creación |
| updated_at | TIMESTAMP | ✅ | - | Fecha de actualización |

## 🛡️ Seguridad

- ✅ Passwords encriptados con bcrypt (10 rounds)
- ✅ JWT tokens con expiración configurable
- ✅ CORS configurado para orígenes específicos
- ✅ Helmet.js para headers de seguridad
- ✅ Validación estricta en todas las capas
- ✅ No se exponen passwords en respuestas
- ✅ Mensajes de error genéricos para credenciales

## 🐛 Troubleshooting

### Error: "column 'username' does not exist"
**Solución:** Ejecutar el script de migración

### Error: "password must be at least 8 characters"
**Solución:** Asegurar que la contraseña tenga 8+ caracteres y un carácter especial

### Error: "username cannot contain spaces"
**Solución:** El username debe ser sin espacios (ej: "johndoe", no "john doe")

### Error: "Token inválido"
**Solución:** Verificar que el token no esté expirado y que el formato sea `Bearer <token>`

## 📞 Soporte

Si encuentras algún problema:

1. Verifica que la migración se ejecutó correctamente
2. Revisa los logs del backend
3. Verifica la estructura de los requests
4. Asegúrate de que el frontend esté usando los endpoints correctos

## 🎉 Conclusión

El backend ahora está **100% ajustado al frontend** con:

✅ Validaciones estrictas (10/10) en todas las operaciones
✅ No permite datos vacíos, nulos o inválidos
✅ Autenticación segura con username
✅ Registro completo con todos los datos institucionales
✅ Respuestas JSON exactas que el frontend espera
✅ Manejo robusto de errores
✅ Compatible con la estructura actual del proyecto
