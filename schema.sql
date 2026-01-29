-- D1 Database Schema for Election Survey 2026 (Knesset 26)

PRAGMA foreign_keys = off;

DROP TABLE IF EXISTS responses;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS surveys;

CREATE TABLE surveys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  survey_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('text', 'multiple', 'yesno')),
  options TEXT,
  FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);

CREATE TABLE responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  survey_id INTEGER NOT NULL,
  answers TEXT NOT NULL,
  submitted_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);

-- Seed: Election Survey 2026 (Knesset 26)
INSERT INTO surveys (title, description) VALUES 
  ('סקר בחירות 2026 - הכנסת ה-26', 'למי היית מצביע/ה אם הבחירות היו מתקיימות היום?');

-- Election questions
INSERT INTO questions (survey_id, question, type, options) VALUES
  (1,
   'במידה והבחירות היו מתקיימות היום, לאיזו מפלגה היית מצביע/ה?',
   'multiple',
   '["הליכוד","יש עתיד","המחנה הממלכתי","ש\"ס","יהדות התורה","עוצמה יהודית","הציונות הדתית","ישראל ביתנו","העבודה","מרצ","חד\"ש-תע\"ל","רע\"ם","בל\"ד"]'
  ),
  (1, 'האם אתה/את מתלבט/ת בין מפלגות?', 'yesno', NULL);

PRAGMA foreign_keys = on;
