-- ============================================================
-- users.sql  –  User accounts and roles
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(50)  NOT NULL UNIQUE,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default roles
INSERT IGNORE INTO roles (name) VALUES ('user'), ('admin');

CREATE TABLE IF NOT EXISTS users (
  id            INT           NOT NULL AUTO_INCREMENT,
  role_id       INT           NOT NULL DEFAULT 1,
  full_name     VARCHAR(120)  NOT NULL,
  email         VARCHAR(200)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  phone         VARCHAR(30)   DEFAULT NULL,
  avatar_url    VARCHAR(500)  DEFAULT NULL,
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlists (
  id             INT  NOT NULL AUTO_INCREMENT,
  user_id        INT  NOT NULL,
  destination_id INT  NOT NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wishlist (user_id, destination_id),
  CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
