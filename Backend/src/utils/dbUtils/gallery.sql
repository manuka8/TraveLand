-- ============================================================
-- gallery.sql  –  Multi-image gallery for entities
-- ============================================================

CREATE TABLE IF NOT EXISTS gallery (
  id           INT           NOT NULL AUTO_INCREMENT,
  entity_type  ENUM('destination', 'package', 'hotel') NOT NULL,
  entity_id    INT           NOT NULL,
  image_url    VARCHAR(500)  NOT NULL,
  is_main      TINYINT(1)    NOT NULL DEFAULT 0,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_gallery_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
