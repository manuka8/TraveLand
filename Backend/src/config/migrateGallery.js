'use strict';

const { pool } = require('./db');

async function migrateImages() {
    console.log('Starting image migration to gallery...');
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Migrate Destinations
        const [destinations] = await connection.execute('SELECT id, image_url FROM destinations WHERE image_url IS NOT NULL');
        for (const dest of destinations) {
            await connection.execute(
                'INSERT IGNORE INTO gallery (entity_type, entity_id, image_url, is_main) VALUES (?, ?, ?, ?)',
                ['destination', dest.id, dest.image_url, 1]
            );
        }
        console.log(`Migrated ${destinations.length} destinations.`);

        // Migrate Packages
        const [packages] = await connection.execute('SELECT id, image_url FROM packages WHERE image_url IS NOT NULL');
        for (const pkg of packages) {
            await connection.execute(
                'INSERT IGNORE INTO gallery (entity_type, entity_id, image_url, is_main) VALUES (?, ?, ?, ?)',
                ['package', pkg.id, pkg.image_url, 1]
            );
        }
        console.log(`Migrated ${packages.length} packages.`);

        // Migrate Hotels
        const [hotels] = await connection.execute('SELECT id, image_url FROM hotels WHERE image_url IS NOT NULL');
        for (const hotel of hotels) {
            await connection.execute(
                'INSERT IGNORE INTO gallery (entity_type, entity_id, image_url, is_main) VALUES (?, ?, ?, ?)',
                ['hotel', hotel.id, hotel.image_url, 1]
            );
        }
        console.log(`Migrated ${hotels.length} hotels.`);

        await connection.commit();
        console.log('Migration completed successfully.');
    } catch (err) {
        await connection.rollback();
        console.error('Migration failed:', err);
    } finally {
        connection.release();
    }
}

migrateImages().then(() => process.exit());
