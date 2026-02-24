'use strict';

const { pool } = require('../config/db');

async function getAll({ destination_id, min_price, max_price, limit = 12, offset = 0 }) {
    let where = 'WHERE p.is_available = 1';
    const params = [];

    if (destination_id) {
        where += ' AND p.destination_id = ?';
        params.push(destination_id);
    }
    if (min_price != null) {
        where += ' AND p.price_per_person >= ?';
        params.push(min_price);
    }
    if (max_price != null) {
        where += ' AND p.price_per_person <= ?';
        params.push(max_price);
    }

    const [rows] = await pool.execute(
        `SELECT p.*, p.price_per_person AS price, p.duration_days AS duration, d.name AS destination_name, d.country, d.image_url AS destination_image
     FROM packages p
     JOIN destinations d ON d.id = p.destination_id
     ${where} ORDER BY p.price_per_person ASC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );
    const [[{ total }]] = await pool.execute(
        `SELECT COUNT(*) AS total FROM packages p ${where}`, params
    );
    return { rows, total };
}

async function getById(id) {
    const [rows] = await pool.execute(
        `SELECT p.*, p.price_per_person AS price, p.duration_days AS duration
         FROM packages p
         WHERE p.id = ? AND p.is_available = 1 LIMIT 1`,
        [id]
    );
    const pkg = rows[0] || null;
    if (!pkg) return null;

    // Fetch destinations
    const [destinations] = await pool.execute(
        `SELECT pd.*, d.name AS destination_name, d.country, d.image_url AS destination_image
         FROM package_destinations pd
         JOIN destinations d ON d.id = pd.destination_id
         WHERE pd.package_id = ? ORDER BY pd.sequence_order ASC`,
        [id]
    );
    pkg.destinations = destinations;

    // Fetch types
    const [types] = await pool.execute(
        'SELECT type_name FROM package_types_map WHERE package_id = ?',
        [id]
    );
    pkg.package_types = types.map(t => t.type_name);

    // Fetch availability
    const [availability] = await pool.execute(
        'SELECT * FROM package_availability WHERE package_id = ? AND available_date >= CURDATE() ORDER BY available_date ASC',
        [id]
    );
    pkg.availability = availability;

    // Fetch hotels
    const [hotels] = await pool.execute(
        `SELECT ph.*, h.name AS hotel_name, h.rating, h.city
         FROM package_hotels ph
         JOIN hotels h ON h.id = ph.hotel_id
         WHERE ph.package_id = ?`,
        [id]
    );
    pkg.hotels = hotels;

    return pkg;
}

async function create(data) {
    const {
        destination_id, title, description, itinerary, duration, duration_days, price, price_per_person,
        max_guests, image_url, destinations, package_types, availability, hotels,
        max_booking_limit, is_group_package
    } = data;

    // Map frontend 'duration' to 'duration_days' and 'price' to 'price_per_person'
    const finalDurationDays = duration_days || duration || 1;
    const finalPricePerPerson = price_per_person || price || 0;

    // Fallback: if destination_id not provided but destinations exists, use first one
    const primaryDestId = destination_id || (destinations && destinations.length > 0 ? destinations[0].destination_id : null);

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const [result] = await connection.execute(
            `INSERT INTO packages (destination_id, title, description, itinerary, duration_days, price_per_person, max_guests, image_url, max_booking_limit, is_group_package)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                primaryDestId,
                title || null,
                description || null,
                itinerary ? JSON.stringify(itinerary) : null,
                finalDurationDays,
                finalPricePerPerson,
                max_guests || 10,
                image_url || null,
                max_booking_limit || 5,
                is_group_package || 0
            ]
        );
        const package_id = result.insertId;

        // Add destinations
        if (destinations && Array.isArray(destinations)) {
            for (const dest of destinations) {
                await connection.execute(
                    'INSERT INTO package_destinations (package_id, destination_id, days_spent, sequence_order) VALUES (?, ?, ?, ?)',
                    [package_id, dest.destination_id, dest.days_spent || 1, dest.sequence_order || 0]
                );
            }
        }

        // Add package types
        if (package_types && Array.isArray(package_types)) {
            for (const type of package_types) {
                await connection.execute(
                    'INSERT INTO package_types_map (package_id, type_name) VALUES (?, ?)',
                    [package_id, type]
                );
            }
        }

        // Add availability
        if (availability && Array.isArray(availability)) {
            for (const slot of availability) {
                await connection.execute(
                    'INSERT INTO package_availability (package_id, available_date, available_slots) VALUES (?, ?, ?)',
                    [package_id, slot.available_date, slot.available_slots || 10]
                );
            }
        }

        // Add hotels
        if (hotels && Array.isArray(hotels)) {
            for (const hotel_id of hotels) {
                await connection.execute(
                    'INSERT INTO package_hotels (package_id, hotel_id) VALUES (?, ?)',
                    [package_id, hotel_id]
                );
            }
        }

        await connection.commit();
        return package_id;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

async function update(id, data) {
    const {
        destination_id, title, description, itinerary, duration, duration_days, price, price_per_person,
        max_guests, image_url, is_available, destinations, package_types, availability, hotels,
        max_booking_limit, is_group_package
    } = data;

    const finalDurationDays = duration_days || duration || 1;
    const finalPricePerPerson = price_per_person || price || 0;
    const primaryDestId = destination_id || (destinations && destinations.length > 0 ? destinations[0].destination_id : null);

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        await connection.execute(
            `UPDATE packages SET destination_id=?, title=?, description=?, itinerary=?,
             duration_days=?, price_per_person=?, max_guests=?, image_url=?, is_available=?, 
             max_booking_limit=?, is_group_package=?, updated_at=NOW()
             WHERE id=?`,
            [
                primaryDestId,
                title || null,
                description || null,
                itinerary ? JSON.stringify(itinerary) : null,
                finalDurationDays,
                finalPricePerPerson,
                max_guests || 10,
                image_url || null,
                is_available ?? 1,
                max_booking_limit || 5,
                is_group_package || 0,
                id
            ]
        );

        // Update destinations
        if (destinations) {
            await connection.execute('DELETE FROM package_destinations WHERE package_id = ?', [id]);
            for (const dest of destinations) {
                await connection.execute(
                    'INSERT INTO package_destinations (package_id, destination_id, days_spent, sequence_order) VALUES (?, ?, ?, ?)',
                    [id, dest.destination_id, dest.days_spent || 1, dest.sequence_order || 0]
                );
            }
        }

        // Update types
        if (package_types) {
            await connection.execute('DELETE FROM package_types_map WHERE package_id = ?', [id]);
            for (const type of package_types) {
                await connection.execute(
                    'INSERT INTO package_types_map (package_id, type_name) VALUES (?, ?)',
                    [id, type]
                );
            }
        }

        // Update availability
        if (availability) {
            await connection.execute('DELETE FROM package_availability WHERE package_id = ?', [id]);
            for (const slot of availability) {
                await connection.execute(
                    'INSERT INTO package_availability (package_id, available_date, available_slots) VALUES (?, ?, ?)',
                    [id, slot.available_date, slot.available_slots || 10]
                );
            }
        }

        // Update hotels
        if (hotels) {
            await connection.execute('DELETE FROM package_hotels WHERE package_id = ?', [id]);
            for (const hotel_id of hotels) {
                await connection.execute(
                    'INSERT INTO package_hotels (package_id, hotel_id) VALUES (?, ?)',
                    [id, hotel_id]
                );
            }
        }

        await connection.commit();
        return 1;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

async function remove(id) {
    const [result] = await pool.execute(
        `UPDATE packages SET is_available = 0 WHERE id = ?`, [id]
    );
    return result.affectedRows;
}

async function checkAvailability(package_id, date, guests) {
    const [rows] = await pool.execute(
        'SELECT available_slots FROM package_availability WHERE package_id = ? AND available_date = ?',
        [package_id, date]
    );
    if (rows.length === 0) return { available: false, message: 'No availability for this date.' };
    const slots = rows[0].available_slots;
    if (slots < guests) return { available: false, message: `Only ${slots} slots available.` };
    return { available: true };
}

async function decrementSlots(package_id, date, guests, connection) {
    const db = connection || pool;
    const [result] = await db.execute(
        'UPDATE package_availability SET available_slots = available_slots - ? WHERE package_id = ? AND available_date = ? AND available_slots >= ?',
        [guests, package_id, date, guests]
    );
    return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove, checkAvailability, decrementSlots };
