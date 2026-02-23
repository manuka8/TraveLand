'use strict';

const { pool } = require('../config/db');

async function getGallery(entityType, entityId) {
    const [rows] = await pool.execute(
        `SELECT id, image_url, is_main FROM gallery WHERE entity_type = ? AND entity_id = ?`,
        [entityType, entityId]
    );
    return rows;
}

async function updateGallery(entityType, entityId, images) {
    // Basic implementation: Clear and re-insert
    // In a production app, we'd compare and only change what's needed
    // But for this simple project, clearing and re-inserting is easier and safe

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Delete old gallery entries
        await connection.execute(
            `DELETE FROM gallery WHERE entity_type = ? AND entity_id = ?`,
            [entityType, entityId]
        );

        // 2. Insert new entries
        if (images && images.length > 0) {
            for (const img of images) {
                await connection.execute(
                    `INSERT INTO gallery (entity_type, entity_id, image_url, is_main) VALUES (?, ?, ?, ?)`,
                    [entityType, entityId, img.url, img.is_main ? 1 : 0]
                );
            }
        }

        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = { getGallery, updateGallery };
