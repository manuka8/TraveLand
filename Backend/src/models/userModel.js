'use strict';

const { pool } = require('../config/db');

// --- Auth-related queries ---

/**
 * Find a user by email (includes role name)
 */
async function findByEmail(email) {
    const [rows] = await pool.execute(
        `SELECT u.*, r.name AS role
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE u.email = ? AND u.is_active = 1
     LIMIT 1`,
        [email]
    );
    return rows[0] || null;
}

/**
 * Find user by ID
 */
async function findById(id) {
    const [rows] = await pool.execute(
        `SELECT u.id, u.full_name, u.email, u.phone, u.avatar_url, u.created_at,
            r.name AS role
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE u.id = ? AND u.is_active = 1
     LIMIT 1`,
        [id]
    );
    return rows[0] || null;
}

/**
 * Create a new user
 */
async function createUser({ full_name, email, password_hash, phone, role_id = 1 }) {
    const [result] = await pool.execute(
        `INSERT INTO users (full_name, email, password_hash, phone, role_id)
     VALUES (?, ?, ?, ?, ?)`,
        [full_name, email, password_hash, phone || null, role_id]
    );
    return result.insertId;
}

/**
 * Update user profile
 */
async function updateUser(id, { full_name, phone, avatar_url }) {
    const [result] = await pool.execute(
        `UPDATE users SET full_name = ?, phone = ?, avatar_url = ?, updated_at = NOW()
     WHERE id = ?`,
        [full_name, phone || null, avatar_url || null, id]
    );
    return result.affectedRows;
}

// --- Admin queries ---

/**
 * Get paginated list of users for admin
 */
async function getAllUsers({ limit = 20, offset = 0 }) {
    const [rows] = await pool.execute(
        `SELECT u.id, u.full_name, u.email, u.phone, u.is_active, u.created_at, r.name AS role
     FROM users u
     JOIN roles r ON r.id = u.role_id
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    const [[{ total }]] = await pool.execute(`SELECT COUNT(*) AS total FROM users`);
    return { rows, total };
}

/**
 * Toggle user active status
 */
async function toggleUserActive(id, is_active) {
    const [result] = await pool.execute(
        `UPDATE users SET is_active = ? WHERE id = ?`,
        [is_active, id]
    );
    return result.affectedRows;
}

// --- Wishlist ---
async function addToWishlist(user_id, destination_id) {
    await pool.execute(
        `INSERT IGNORE INTO wishlists (user_id, destination_id) VALUES (?, ?)`,
        [user_id, destination_id]
    );
}

async function removeFromWishlist(user_id, destination_id) {
    await pool.execute(
        `DELETE FROM wishlists WHERE user_id = ? AND destination_id = ?`,
        [user_id, destination_id]
    );
}

async function getWishlist(user_id) {
    const [rows] = await pool.execute(
        `SELECT d.* FROM wishlists w
     JOIN destinations d ON d.id = w.destination_id
     WHERE w.user_id = ?
     ORDER BY w.created_at DESC`,
        [user_id]
    );
    return rows;
}

module.exports = {
    findByEmail, findById, createUser, updateUser,
    getAllUsers, toggleUserActive,
    addToWishlist, removeFromWishlist, getWishlist,
};
