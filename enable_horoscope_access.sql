-- Enable RLS (if not already)
ALTER TABLE daily_horoscopes ENABLE ROW LEVEL SECURITY;

-- 1. Allow everyone (public/anon) to read horoscopes
CREATE POLICY "Allow public read access"
ON daily_horoscopes
FOR SELECT
TO anon, authenticated
USING (true);

-- 2. Allow the scraper (using anon key) to Insert new horoscopes
CREATE POLICY "Allow anon insert"
ON daily_horoscopes
FOR INSERT 
TO anon
WITH CHECK (true);

-- 3. Allow the scraper to Update existing horoscopes (for upsert)
CREATE POLICY "Allow anon update"
ON daily_horoscopes
FOR UPDATE
TO anon
USING (true);
