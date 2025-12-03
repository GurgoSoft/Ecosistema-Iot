# ⚡ Inicio Rápido - Backend Actualizado

## 🔧 Paso 1: Migrar la Base de Datos

```powershell
cd Backend
node scripts/migrate-users-table.js
```

**Salida esperada:**
```
🔄 Iniciando migración de tabla users...
✅ Columnas agregadas
✅ Datos migrados
✅ Restricción UNIQUE agregada
✅ Campos configurados como NOT NULL
✅ ENUM de roles actualizado
✅ ¡Migración completada exitosamente!
```

## 🚀 Paso 2: Instalar Dependencias (si es necesario)

```powershell
npm install
```

## ▶️ Paso 3: Iniciar el Backend

```powershell
npm run dev
```

**Salida esperada:**
```
🗄️  Base de datos PostgreSQL conectada exitosamente
🚀 Servidor corriendo en http://localhost:5000
```

## ✅ Paso 4: Probar los Endpoints

```powershell
# En otra terminal
node tests/manual/testAuthEndpoints.js
```

**Resultado esperado:**
```
🎉 ¡TODAS LAS PRUEBAS PASARON!
✅ El backend está 100% funcional y compatible con el frontend
```

## 🎯 Endpoints Disponibles

### 1. **Registro**
```
POST http://localhost:5000/api/auth/register
```

**Body:**
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

### 2. **Login**
```
POST http://localhost:5000/api/auth/login
```

**Body:**
```json
{
  "username": "johndoe",
  "password": "Password123!"
}
```

### 3. **Obtener Usuario Actual**
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token>
```

## 🔍 Verificar que Todo Funciona

1. ✅ Backend corriendo en puerto 5000
2. ✅ Migración ejecutada sin errores
3. ✅ Pruebas pasando 100%
4. ✅ Frontend puede conectarse

## 🐛 Solución de Problemas

### "column 'username' does not exist"
➡️ Ejecutar: `node scripts/migrate-users-table.js`

### "Cannot connect to database"
➡️ Verificar conexión en `src/config/config.js`

### "Port 5000 already in use"
➡️ Cambiar puerto en `.env` o `src/config/config.js`

## 📚 Documentación Completa

Lee `AUTHENTICATION-UPDATE.md` para:
- Detalles de todas las validaciones
- Estructura completa de la base de datos
- Pruebas manuales con Postman
- Troubleshooting detallado

---

**¿Listo para usar?** El backend ahora acepta exactamente lo que el frontend envía con validaciones estrictas (10/10). 🎉
