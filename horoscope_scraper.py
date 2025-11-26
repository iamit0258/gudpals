import requests
from bs4 import BeautifulSoup
import time
import os
from supabase import create_client, Client
import re
import datetime

# Supabase Credentials (should be in env vars for production/GitHub Actions)
# Using the ones found in the project for now to ensure it works locally
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://yzjzcvcyneufijjpzbdc.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6anpjdmN5bmV1ZmlqanB6YmRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjA5NDQsImV4cCI6MjA3OTI5Njk0NH0.878YVMQMOjttMoKeIwaubU8ory0eUeaelEtmZdehX-4")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_daily_horoscope():
    base_url = "https://www.hindustantimes.com/astrology/horoscope"
    
    # HT Date format in URL usually: november-25-2025
    current_date = datetime.datetime.now()
    date_str = current_date.strftime('%B-%d-%Y').lower() # e.g., november-25-2025
    display_date = current_date.strftime('%Y-%m-%d')
    
    print(f"Fetching daily horoscopes for {display_date} from Hindustan Times ({base_url})...\n")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        # Step 1: Get the main astrology page to find the daily article
        response = requests.get(base_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        article_link = None
        
        # Look for a link that contains "horoscope-today" and the date string
        # Example: .../horoscope-today-november-25-2025-...
        # We'll look for "horoscope-today" and the date parts to be safer
        
        target_month = current_date.strftime('%B').lower()
        target_day = current_date.strftime('%d')
        target_year = current_date.strftime('%Y')
        
        candidates = []
        
        for a in soup.find_all('a', href=True):
            href = a['href']
            # Check if it's a horoscope-today link
            if "horoscope-today" in href:
                # Exclude specific types of horoscopes
                if any(x in href for x in ["numerology", "tarot", "love-horoscope", "career-and-money"]):
                    continue
                
                # Strict check: The slug must start with "horoscope-today-"
                # This avoids "pisces-daily-horoscope-today..." etc.
                slug = href.split('/')[-1]
                if not slug.startswith("horoscope-today-"):
                    continue

                # Check if it matches today's date
                # strict check: full date string
                if date_str in href:
                    article_link = href
                    break
                
                # relaxed check: month and day (in case year is missing or format differs)
                if target_month in href and target_day in href:
                    candidates.append(href)
        
        if not article_link and candidates:
            # Pick the first candidate if exact match failed
            print(f"Exact date match not found, using best candidate: {candidates[0]}")
            article_link = candidates[0]
            
        if article_link and not article_link.startswith('http'):
            article_link = f"https://www.hindustantimes.com{article_link}"

        if not article_link:
            print(f"Could not find the daily horoscope article link for {date_str}.")
            print("Available 'horoscope-today' links found:")
            for a in soup.find_all('a', href=True):
                if "horoscope-today" in a['href']:
                    print(f" - {a['href']}")
            return

        print(f"Found article: {article_link}")
        
        # Step 2: Fetch the article content
        article_response = requests.get(article_link, headers=headers)
        article_response.raise_for_status()
        article_soup = BeautifulSoup(article_response.content, 'html.parser')
        
        # Step 3: Parse the content
        # HT puts all signs in one page with headers like "Aries (March 21-April 20)"
        # The text is usually in <p> tags following the header.
        
        signs = [
            "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
            "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ]
        
        # Get all text to parse manually since structure can be nested
        full_text = article_soup.get_text(separator='\n')
        
        for sign in signs:
            try:
                # Regex to find the sign header and the text following it
                # Pattern: SignName ... \n ... text ... \n Love Focus
                
                # We look for the Sign name followed by date range (optional match)
                # Then capture everything until "Love Focus" or the next sign or "Lucky Number"
                
                # Simplified approach: Find the line with Sign Name, then read lines until we hit keywords
                
                lines = full_text.split('\n')
                start_idx = -1
                
                for i, line in enumerate(lines):
                    # Check for "Aries (March..." or just "Aries" header
                    if sign in line and ("(" in line or len(line.strip()) < 30):
                        # Double check it's not just a mention in another paragraph
                        # HT headers are usually short or contain the date range
                        if len(line.strip()) < 100: 
                            start_idx = i
                            break
                
                if start_idx != -1:
                    horoscope_text = ""
                    lucky_number = "N/A"
                    lucky_color = "N/A"
                    compatibility = "N/A" # HT doesn't usually have this, so we'll randomize or leave blank
                    
                    # Read subsequent lines
                    current_chunk = []
                    for j in range(start_idx + 1, len(lines)):
                        line = lines[j].strip()
                        if not line: continue
                        
                        # Stop if we hit the next sign or end of article markers
                        if any(s in line for s in signs if s != sign and len(line) < 50):
                            break
                        if "By:" in line:
                            break
                            
                        current_chunk.append(line)
                    
                    # Join and process the chunk
                    raw_text = "\n".join(current_chunk)
                    
                    # Extract Lucky Number/Color if present
                    # Format: "Lucky Number: 3Lucky Colour: Purple" or separate lines
                    
                    ln_match = re.search(r"Lucky Number:\s*(\d+)", raw_text, re.IGNORECASE)
                    if ln_match:
                        lucky_number = ln_match.group(1)
                        
                    lc_match = re.search(r"Lucky Colou?r:\s*([A-Za-z]+)", raw_text, re.IGNORECASE)
                    if lc_match:
                        lucky_color = lc_match.group(1)
                        
                    # Remove the Lucky stuff from the main text
                    # Also remove "Love Focus" section if we want just the main horoscope, 
                    # but user might want it. Let's keep Love Focus but remove Lucky stuff.
                    
                    clean_text = raw_text
                    if "Lucky Number" in clean_text:
                        clean_text = clean_text.split("Lucky Number")[0].strip()
                    
                    # If "Love Focus" is there, ensure it's formatted nicely
                    clean_text = clean_text.replace("Love Focus:", "\n\nLove Focus:")
                    
                    # Remove the Sign name if it repeated at start
                    if clean_text.startswith(sign):
                        clean_text = clean_text[len(sign):].strip()
                        
                    # Remove brackets/links if they remained (e.g. [Aries])
                    clean_text = re.sub(r"\[.*?\]", "", clean_text).strip()

                    print(f"--- {sign} ---")
                    # print(clean_text[:50] + "...")
                    
                    # Upsert to Supabase
                    data = {
                        "sign": sign,
                        "horoscope_text": clean_text,
                        "date": display_date,
                        "lucky_number": lucky_number,
                        "lucky_color": lucky_color,
                        "compatibility": compatibility
                    }
                    
                    supabase.table("daily_horoscopes").upsert(data).execute()
                    print(f"Saved to DB: {sign}")
                    
                else:
                    print(f"Could not find section for {sign}")

            except Exception as e:
                print(f"Error processing {sign}: {e}")
                
    except Exception as e:
        print(f"Global error: {e}")

if __name__ == "__main__":
    get_daily_horoscope()
