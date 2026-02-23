-- ============================================================
-- payments.sql  –  Payment records
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
  id             INT           NOT NULL AUTO_INCREMENT,
  booking_id     INT           NOT NULL,
  user_id        INT           NOT NULL,
  amount         DECIMAL(12,2) NOT NULL,
  currency       VARCHAR(10)   NOT NULL DEFAULT 'USD',
  method         VARCHAR(50)   DEFAULT NULL,       -- card, paypal, bank…
  transaction_id VARCHAR(200)  DEFAULT NULL UNIQUE,
  status         ENUM('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  paid_at        DATETIME      DEFAULT NULL,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_payment_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  INDEX idx_payment_booking (booking_id),
  INDEX idx_payment_status  (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
