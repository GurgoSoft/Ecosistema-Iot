/**
 * Servidor Principal
 * Punto de entrada de la aplicación
 */

const createApp = require('./app');
const { connectDB, sequelize } = require('./config/database');
const { setupAssociations } = require('./models');
const config = require('./config/config');

/**
 * Iniciar servidor
 */
const startServer = async () => {
  try {
    // Configurar asociaciones de modelos
    setupAssociations();

    // Conectar a la base de datos
    await connectDB();

    // Crear aplicación
    const app = createApp();

    // Iniciar servidor
    const PORT = config.server.port;
    const server = app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║   🌾 Agriculture Backend API                      ║
║   Server running in ${config.server.env} mode              ║
║   Port: ${PORT}                                    ║
║   URL: http://localhost:${PORT}                    ║
║   Database: PostgreSQL                            ║
╚═══════════════════════════════════════════════════╝
      `);
    });

    // Manejo de errores del servidor
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

    // Manejo de cierre graceful
    const gracefulShutdown = async (signal) => {
      console.log(`\n⚠️  ${signal} received. Closing server gracefully...`);
      
      server.close(async () => {
        console.log('✅ Server closed');
        
        try {
          await sequelize.close();
          console.log('✅ Database connection closed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error closing database:', error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forcing shutdown...');
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de terminación
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Manejo de errores no capturados
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();
