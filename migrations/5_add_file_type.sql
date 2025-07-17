ALTER TABLE clipboard
ADD type TEXT NOT NULL CHECK (type IN ('text', 'image', 'link', 'file')) ;
