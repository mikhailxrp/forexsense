CREATE TABLE IF NOT EXISTS analyses (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  pair            VARCHAR(10)                         NOT NULL,
  sentiment       ENUM('bullish','bearish','neutral')  NOT NULL,
  signal_strength TINYINT UNSIGNED                    NOT NULL,
  base_currency   VARCHAR(3)                          NOT NULL,
  quote_currency  VARCHAR(3)                          NOT NULL,
  base_summary    TEXT                                NOT NULL,
  quote_summary   TEXT                                NOT NULL,
  recommendation  TEXT                                NOT NULL,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS news_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  analysis_id  INT          NOT NULL,
  source       VARCHAR(100) NOT NULL,
  headline     TEXT         NOT NULL,
  summary      TEXT,
  url          VARCHAR(500),
  currency     VARCHAR(3),
  published_at DATETIME,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_news_analysis
    FOREIGN KEY (analysis_id) REFERENCES analyses(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS key_events (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  analysis_id  INT                         NOT NULL,
  event_time   TIME                        NOT NULL,
  event_name   VARCHAR(255)                NOT NULL,
  currency     VARCHAR(3)                  NOT NULL,
  impact       ENUM('High','Medium','Low') NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_events_analysis
    FOREIGN KEY (analysis_id) REFERENCES analyses(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;