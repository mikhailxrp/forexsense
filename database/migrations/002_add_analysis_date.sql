-- Добавляет колонку analysis_date для уникального индекса
-- (MySQL на Beget не поддерживает функции в UNIQUE INDEX)

ALTER TABLE analyses
ADD COLUMN analysis_date DATE NOT NULL DEFAULT '1970-01-01';

ALTER TABLE analyses
ADD UNIQUE INDEX idx_pair_date (pair, analysis_date);
