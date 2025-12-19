-- Enable RLS (if not already)
ALTER TABLE daily_horoscopes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for anon users like the Voice Assistant)
CREATE POLICY "Allow public read access"
ON daily_horoscopes
FOR SELECT
TO anon, authenticated
USING (true);

-- Verify it worked by checking policies (Optional)
SELECT * FROM pg_policies WHERE tablename = 'daily_horoscopes';
