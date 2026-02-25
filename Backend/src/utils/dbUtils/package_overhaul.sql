-- ============================================================
-- package_overhaul.sql
-- ============================================================

-- 1. Package Destinations (Multi-destination support)
CREATE TABLE IF NOT EXISTS package_destinations (
  id              INT           NOT NULL AUTO_INCREMENT,
  package_id      INT           NOT NULL,
  destination_id  INT           NOT NULL,
  days_spent      INT           NOT NULL DEFAULT 1,
  sequence_order  INT           NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT fk_pd_package     FOREIGN KEY (package_id)     REFERENCES packages(id)     ON DELETE CASCADE,
  CONSTRAINT fk_pd_destination FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
  INDEX idx_pd_package (package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Package Types Map (Luxury, Budget, etc.)
CREATE TABLE IF NOT EXISTS package_types_map (
  id              INT           NOT NULL AUTO_INCREMENT,
  package_id      INT           NOT NULL,
  type_name       ENUM('Luxury', 'Budget', 'Adventure', 'Honeymoon', 'Family/Group') NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_ptm_package    FOREIGN KEY (package_id)     REFERENCES packages(id)     ON DELETE CASCADE,
  INDEX idx_ptm_package (package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Package Availability & Slots
CREATE TABLE IF NOT EXISTS package_availability (
  id              INT           NOT NULL AUTO_INCREMENT,
  package_id      INT           NOT NULL,
  available_date  DATE          NOT NULL,
  available_slots INT           NOT NULL DEFAULT 10,
  PRIMARY KEY (id),
  CONSTRAINT fk_pa_package     FOREIGN KEY (package_id)     REFERENCES packages(id)     ON DELETE CASCADE,
  UNIQUE INDEX idx_package_date (package_id, available_date),
  INDEX idx_pa_date (available_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Package Hotels
CREATE TABLE IF NOT EXISTS package_hotels (
  id              INT           NOT NULL AUTO_INCREMENT,
  package_id      INT           NOT NULL,
  hotel_id        INT           NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_ph_package     FOREIGN KEY (package_id)     REFERENCES packages(id)     ON DELETE CASCADE,
  CONSTRAINT fk_ph_hotel       FOREIGN KEY (hotel_id)       REFERENCES hotels(id)       ON DELETE CASCADE,
  INDEX idx_ph_package (package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Add travel_package_type and travel_limit columns to packages
ALTER TABLE packages ADD COLUMN max_booking_limit INT DEFAULT 5;
ALTER TABLE packages ADD COLUMN is_group_package TINYINT(1) DEFAULT 0;


-- 6. Update bookings to link to availability slot instead of just a date (optional but recommended)
-- For now, we will validate against package_availability table during booking creation.
