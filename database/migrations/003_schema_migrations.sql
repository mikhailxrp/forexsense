-- Журнал применённых миграций. Выполнять после 001_init и 002_add_analysis_date.
-- Идемпотентно: повторный запуск безопасен (INSERT IGNORE).
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) NOT NULL PRIMARY KEY,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO schema_migrations (version) VALUES
  ('001_init'),
  ('002_add_analysis_date');
