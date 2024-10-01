CREATE TABLE url (
                     id SERIAL PRIMARY KEY,
                     original_url TEXT UNIQUE NOT NULL,
                     slug TEXT UNIQUE NOT NULL,
                     visit_count INTEGER DEFAULT 0,
                     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_url_updated_at
    BEFORE UPDATE ON url
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();