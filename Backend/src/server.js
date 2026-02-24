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
        console.error('  ✖ Failed to start server:', err.message);
        console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
        process.exit(1);
    }
}

startServer();
