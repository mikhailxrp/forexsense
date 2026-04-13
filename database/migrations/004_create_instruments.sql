-- Создание таблицы инструментов (валютных пар)
-- Миграция: 004_create_instruments.sql (003 занят под schema_migrations)

CREATE TABLE IF NOT EXISTS instruments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  symbol     VARCHAR(10)  NOT NULL COMMENT 'Символ пары в верхнем регистре, напр. EUR/USD',
  base       VARCHAR(3)   NOT NULL COMMENT 'Базовая валюта, напр. EUR',
  quote      VARCHAR(3)   NOT NULL COMMENT 'Котируемая валюта, напр. USD',
  is_active  TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '1 - активна, 0 - скрыта',
  sort_order INT          NOT NULL DEFAULT 0 COMMENT 'Порядок отображения в селекте',
  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,

  UNIQUE INDEX idx_symbol (symbol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO instruments (symbol, base, quote, is_active, sort_order) VALUES
('EUR/USD', 'EUR', 'USD', 1, 1),
('GBP/USD', 'GBP', 'USD', 1, 2),
('USD/CHF', 'USD', 'CHF', 1, 3),
('USD/JPY', 'USD', 'JPY', 1, 4),
('USD/CAD', 'USD', 'CAD', 1, 5),
('AUD/USD', 'AUD', 'USD', 1, 6),
('EUR/GBP', 'EUR', 'GBP', 1, 7),
('EUR/AUD', 'EUR', 'AUD', 1, 8),
('EUR/CHF', 'EUR', 'CHF', 1, 9),
('EUR/JPY', 'EUR', 'JPY', 1, 10),
('GBP/CHF', 'GBP', 'CHF', 1, 11),
('CAD/JPY', 'CAD', 'JPY', 1, 12),
('GBP/JPY', 'GBP', 'JPY', 1, 13),
('AUD/NZD', 'AUD', 'NZD', 1, 14),
('AUD/CAD', 'AUD', 'CAD', 1, 15),
('AUD/CHF', 'AUD', 'CHF', 1, 16),
('AUD/JPY', 'AUD', 'JPY', 1, 17),
('CHF/JPY', 'CHF', 'JPY', 1, 18),
('EUR/NZD', 'EUR', 'NZD', 1, 19),
('EUR/CAD', 'EUR', 'CAD', 1, 20),
('CAD/CHF', 'CAD', 'CHF', 1, 21),
('NZD/JPY', 'NZD', 'JPY', 1, 22),
('NZD/USD', 'NZD', 'USD', 1, 23),
('GBP/AUD', 'GBP', 'AUD', 1, 24),
('GBP/CAD', 'GBP', 'CAD', 1, 25),
('GBP/NZD', 'GBP', 'NZD', 1, 26),
('NZD/CAD', 'NZD', 'CAD', 1, 27),
('NZD/CHF', 'NZD', 'CHF', 1, 28);

INSERT IGNORE INTO schema_migrations (version) VALUES ('004_create_instruments');
