-- Migración: Actualizar tabla users con nuevos campos requeridos por el frontend
-- Fecha: 2025-12-02
-- Descripción: Agregar campos de username, firstName, lastName y campos institucionales

-- PASO 1: Agregar nuevas columnas
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS first_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS area_of_work VARCHAR(50),
ADD COLUMN IF NOT EXISTS company_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS company_website VARCHAR(255);

-- PASO 2: Migrar datos existentes (si hay registros)
-- Generar username a partir del email para usuarios existentes
UPDATE users 
SET username = SPLIT_PART(email, '@', 1)
WHERE username IS NULL;

-- Dividir 'name' en 'first_name' y 'last_name' para usuarios existentes
UPDATE users 
SET 
  first_name = COALESCE(SPLIT_PART(name, ' ', 1), 'Usuario'),
  last_name = COALESCE(NULLIF(SPLIT_PART(name, ' ', 2), ''), 'Apellido')
WHERE first_name IS NULL OR last_name IS NULL;

-- Establecer valores por defecto para campos institucionales
UPDATE users 
SET 
  area_of_work = 'other',
  company_name = 'No especificado',
  company_website = 'https://example.com'
WHERE area_of_work IS NULL;

-- PASO 3: Hacer campos obligatorios (NOT NULL)
ALTER TABLE users 
ALTER COLUMN username SET NOT NULL,
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL,
ALTER COLUMN area_of_work SET NOT NULL,
ALTER COLUMN company_name SET NOT NULL,
ALTER COLUMN company_website SET NOT NULL;

-- PASO 4: Eliminar columna 'name' antigua (opcional - comentado por seguridad)
-- ALTER TABLE users DROP COLUMN IF EXISTS name;

-- PASO 5: Eliminar columna 'address' si no se usa (opcional - comentado por seguridad)
-- ALTER TABLE users DROP COLUMN IF EXISTS address;

-- PASO 6: Actualizar restricción de password para 8 caracteres mínimos
-- (Esto se maneja en la capa de aplicación)

-- PASO 7: Actualizar ENUM de role si es necesario
-- ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
-- ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'viewer'));

-- VERIFICACIÓN: Listar estructura de la tabla
-- SELECT column_name, data_type, character_maximum_length, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'users' 
-- ORDER BY ordinal_position;
