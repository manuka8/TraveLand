-- ============================================================
-- bookings.sql  –  Reservations
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
  id            INT           NOT NULL AUTO_INCREMENT,
  user_id       INT           NOT NULL,
  package_id    INT           NOT NULL,
  guests        INT           NOT NULL DEFAULT 1,
  travel_date   DATE          NOT NULL,
  return_date   DATE          DEFAULT NULL,
  total_price   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status        ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  notes         TEXT          DEFAULT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_booking_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_booking_package FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  INDEX idx_booking_user   (user_id),
  INDEX idx_booking_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
