CREATE TABLE clipboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK (type IN ('text', 'image', 'link')),
    datetime TEXT NOT NULL,
    value TEXT NOT NULL,
    width INTEGER,
    height INTEGER
);
