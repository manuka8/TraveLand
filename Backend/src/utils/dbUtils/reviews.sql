-- ============================================================
-- reviews.sql  –  Destination reviews
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  id             INT       NOT NULL AUTO_INCREMENT,
  destination_id INT       NOT NULL,
  user_id        INT       NOT NULL,
  rating         TINYINT   NOT NULL DEFAULT 5,   -- 1–5
  title          VARCHAR(200) DEFAULT NULL,
  body           TEXT      DEFAULT NULL,
  is_approved    TINYINT(1) NOT NULL DEFAULT 1,
  created_at     DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_review_destination FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_user        FOREIGN KEY (user_id)        REFERENCES users(id)        ON DELETE CASCADE,
  UNIQUE KEY uq_review (destination_id, user_id),
  INDEX idx_review_destination (destination_id),
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
