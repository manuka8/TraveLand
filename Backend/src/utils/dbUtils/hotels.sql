-- ============================================================
-- hotels.sql  –  Hotel management
-- ============================================================

CREATE TABLE IF NOT EXISTS hotels (
  id            INT           NOT NULL AUTO_INCREMENT,
  name          VARCHAR(200)  NOT NULL,
  description   TEXT,
  address       VARCHAR(300)  NOT NULL,
  city          VARCHAR(100)  NOT NULL,
  rating        DECIMAL(2,1)  DEFAULT 0.0,
  amenities     TEXT,         -- Comma separated list
  price_per_night DECIMAL(10,2) NOT NULL,
  image_url     VARCHAR(500)  DEFAULT NULL,
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed some default hotels for initial display
INSERT IGNORE INTO hotels (name, description, address, city, rating, amenities, price_per_night, image_url) VALUES 
('Grand Luxury Resort', 'A premium experience with ocean views and world-class service.', '123 Beachwood Ave', 'Bali', 4.8, 'Pool, Spa, Gym, Free WiFi, Restaurant', 250.00, 'images/hotel1.jpg'),
('Mountain Peak Lodge', 'Relax in the heart of nature with breathtaking mountain views.', '456 Alpine Trail', 'Switzerland', 4.5, 'Fireplace, Hiking, Free WiFi, Breakfast', 180.00, 'images/hotel2.jpg'),
('City Center Plaza', 'Smart stay in the heart of the bustling city.', '789 Urban Way', 'New York', 4.2, 'Gym, Business Center, Room Service', 300.00, 'images/hotel3.jpg');
