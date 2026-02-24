'use strict';

require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');
const { initDatabase } = require('./utils/dbInit');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // 1. Test DB connection
        await testConnection();
        console.log('  ✔ Database connected');

        // 2. Run SQL migrations (creates tables if not exist)
        await initDatabase();

        // 3. Start HTTP server
        app.listen(PORT, () => {
            console.log('');
            console.log('╔═══════════════════════════════════════╗');
            console.log('║       TraveLand API Server             ║');
            console.log('╚═══════════════════════════════════════╝');
            console.log(`  🚀 Server running on port ${PORT}`);
            console.log(`  🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`  📡 API base: http://localhost:${PORT}/api`);
            console.log('');
        });
    } catch (err) {
        console.error('  ✖ Failed to start server:');
        console.error('    Code   :', err.code || 'N/A');
        console.error('    Message:', err.message || 'No message – check DB is running');
        console.error('    Detail :', err.sqlMessage || err.cause?.message || err.toString());
        console.error('');
        console.error('  DB Config being used:');
        console.error('    HOST    :', process.env.MYSQLHOST || process.env.DB_HOST || 'localhost');
        console.error('    PORT    :', process.env.MYSQLPORT || process.env.DB_PORT || '3306');
        console.error('    USER    :', process.env.MYSQLUSER || process.env.DB_USER || 'root');
        console.error('    DATABASE:', process.env.MYSQLDATABASE || process.env.DB_NAME || 'traveland_db');
        process.exit(1);
    }
}

startServer();
