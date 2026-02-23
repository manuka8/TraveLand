-- ============================================================
-- packages.sql  –  Travel packages
-- ============================================================

CREATE TABLE IF NOT EXISTS packages (
  id              INT           NOT NULL AUTO_INCREMENT,
  destination_id  INT           NOT NULL,
  title           VARCHAR(200)  NOT NULL,
  description     TEXT          DEFAULT NULL,
  itinerary       TEXT          DEFAULT NULL,      -- JSON array of day-wise plans
  duration_days   INT           NOT NULL DEFAULT 1,
  price_per_person DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  max_guests      INT           NOT NULL DEFAULT 10,
  image_url       VARCHAR(500)  DEFAULT NULL,
  is_available    TINYINT(1)    NOT NULL DEFAULT 1,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_pkg_destination FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
  INDEX idx_pkg_destination (destination_id),
  INDEX idx_pkg_price (price_per_person)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
