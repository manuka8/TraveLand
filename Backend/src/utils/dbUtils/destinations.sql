-- ============================================================
-- destinations.sql  –  Travel destinations
-- ============================================================

CREATE TABLE IF NOT EXISTS destinations (
  id           INT           NOT NULL AUTO_INCREMENT,
  name         VARCHAR(200)  NOT NULL,
  country      VARCHAR(100)  NOT NULL,
  region       VARCHAR(100)  DEFAULT NULL,
  description  TEXT          DEFAULT NULL,
  image_url    VARCHAR(500)  DEFAULT NULL,
  category     VARCHAR(80)   DEFAULT NULL,        -- beach, mountain, city, nature…
  avg_rating   DECIMAL(3,2)  NOT NULL DEFAULT 0.00,
  total_reviews INT          NOT NULL DEFAULT 0,
  is_featured  TINYINT(1)   NOT NULL DEFAULT 0,
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_dest_country (country),
  INDEX idx_dest_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
