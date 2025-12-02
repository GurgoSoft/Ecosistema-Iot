# Front Ecosistema IoT

Una aplicación web moderna construida con React y TypeScript para la gestión de un ecosistema de dispositivos IoT. Incluye sistema completo de autenticación y dashboard responsivo.

## 🚀 Características

- **Sistema de Autenticación**: Login y registro con validación completa
- **Dashboard Principal**: Vista general del estado de todos los dispositivos
- **Gestión de Dispositivos**: Monitoreo en tiempo real de sensores, actuadores y gateways
- **Diseño Responsivo**: Interfaz 100% adaptable a dispositivos móviles y desktop
- **Arquitectura Modular**: Componentes reutilizables y servicios organizados
- **TypeScript**: Tipado fuerte para mayor robustez del código

## 🛠 Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Superset de JavaScript con tipado estático
- **Vite** - Herramienta de desarrollo rápida con SWC
- **Axios** - Cliente HTTP para comunicación con APIs
- **CSS3** - Estilos personalizados con diseño responsive

## 📁 Estructura del Proyecto

```
src/
├── components/              # Componentes reutilizables
│   ├── auth/               # Componentes de autenticación
│   │   ├── Login.tsx       # Componente de login
│   │   ├── Login.css       # Estilos del login
│   │   ├── Register.tsx    # Componente de registro
│   │   └── Register.css    # Estilos del registro
│   └── DeviceCard.tsx      # Tarjeta de dispositivo IoT
├── pages/                  # Páginas de la aplicación
│   ├── auth/              # Páginas de autenticación
│   │   └── AuthPage.tsx   # Página principal de auth
│   └── Dashboard.tsx      # Dashboard principal
├── services/              # Servicios y APIs
│   └── api.ts            # Configuración de Axios y servicios
├── types/                # Definiciones de tipos TypeScript
│   └── index.ts          # Tipos para dispositivos y usuarios
├── App.tsx               # Componente principal con routing
├── main.tsx              # Punto de entrada
└── index.css             # Estilos globales
```

## 🎨 Diseño y UX

### Sistema de Autenticación
- **Login**: Interfaz elegante con vista previa del dashboard
- **Registro**: Formulario completo con validación en tiempo real
- **Diseño Responsivo**: Adaptable desde 320px hasta pantallas grandes
- **Animaciones**: Transiciones suaves y efectos hover

### Dashboard IoT
- **Estadísticas en Tiempo Real**: Contadores de dispositivos y estado
- **Tarjetas de Dispositivos**: Vista organizada con información clave
- **Indicadores Visuales**: Estados por colores (online, offline, error)
- **Navegación Intuitiva**: Botón de logout y menú claro

## 🚦 Instalación y Uso

### Prerequisitos

- Node.js 16+ 
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone [tu-repositorio]
cd front-ecosistema-iot
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
# Crea un archivo .env en la raíz del proyecto
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Ecosistema IoT
VITE_APP_VERSION=1.0.0
```

### Comandos Disponibles

```bash
# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar la versión de producción
npm run preview

# Ejecutar el linter
npm run lint
```

## 🔐 Sistema de Autenticación

### Funcionalidades Implementadas

- **Login**: Validación de usuario y contraseña
- **Registro**: Creación de cuenta con validación completa
- **Validación en Tiempo Real**: Mensajes de error dinámicos
- **Navegación Fluida**: Cambio entre login y registro
- **Diseño Responsivo**: Funciona perfectamente en móviles

### Campos de Registro
- Username (mínimo 3 caracteres)
- Email (validación de formato)
- Password (mínimo 6 caracteres)
- Confirmación de password (debe coincidir)

## 🔧 Configuración del Backend

Esta aplicación está diseñada para conectarse con un backend Node.js. La URL de la API se configura en el archivo `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

### Endpoints Esperados

**Autenticación:**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

**Dispositivos:**
- `GET /api/devices` - Obtener todos los dispositivos
- `GET /api/devices/:id` - Obtener dispositivo por ID
- `POST /api/devices` - Crear nuevo dispositivo
- `PUT /api/devices/:id` - Actualizar dispositivo
- `DELETE /api/devices/:id` - Eliminar dispositivo

## 📱 Tipos de Dispositivos Soportados

- **Sensores**: Dispositivos de recolección de datos (temperatura, humedad, presión)
- **Actuadores**: Dispositivos de control (luces, motores, válvulas)
- **Gateways**: Dispositivos de comunicación y concentración
- **Controladores**: Dispositivos de procesamiento y lógica

## 🎯 Estados de Dispositivos

- **Online**: Dispositivo conectado y funcionando
- **Offline**: Dispositivo desconectado
- **Error**: Dispositivo con fallos detectados
- **Maintenance**: Dispositivo en mantenimiento

## 📱 Responsive Design

La aplicación está optimizada para:
- **Móviles**: 320px - 768px
- **Tablets**: 768px - 1024px
- **Desktop**: 1024px+

### Breakpoints Principales
- 480px: Ajustes para móviles pequeños
- 768px: Cambio a diseño de columna única
- 1024px: Ajustes para tablets
- 1200px+: Diseño completo de escritorio

## 🚀 Próximas Características

- [ ] Integración completa con backend
- [ ] Notificaciones push en tiempo real
- [ ] Gráficos interactivos y visualización de datos
- [ ] Configuración avanzada de dispositivos
- [ ] Historial de eventos y logs
- [ ] Exportación de datos a CSV/PDF
- [ ] Temas personalizables (modo oscuro)
- [ ] Autenticación con OAuth (Google, GitHub)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.

---

**Desarrollado para el ecosistema IoT** 🌐