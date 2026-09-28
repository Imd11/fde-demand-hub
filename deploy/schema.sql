CREATE TABLE IF NOT EXISTS requirements (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question text NOT NULL CHECK (char_length(question) BETWEEN 1 AND 2000),
  name varchar(80) NOT NULL,
  company varchar(160) NOT NULL,
  contact varchar(160) NOT NULL,
  status text NOT NULL DEFAULT 'new',
  internal_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
