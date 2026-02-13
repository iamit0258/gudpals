import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup
import time
import os
from supabase import create_client, Client
import re
import datetime

# Supabase Credentials
# Using 'or' to ensure defaults are used if environment variables are set to empty strings in CI
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_daily_horoscope():
    base_url = "https://www.hindustantimes.com/astrology/horoscope"
    
    # HT Date format in URL usually: november-25-2025 or november-6-2025
    current_date = datetime.datetime.now()
    
    # Generate both formats to be safe
    date_str_padded = current_date.strftime('%B-%d-%Y').lower() # e.g., december-06-2025
    date_str_simple = f"{current_date.strftime('%B').lower()}-{current_date.day}-{current_date.year}" # e.g., december-6-2025
    display_date = current_date.strftime('%Y-%m-%d')
    
    print(f"Fetching daily horoscopes for {display_date} from Hindustan Times ({base_url})...\n")
    
    # Configure retry strategy
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["HEAD", "GET", "OPTIONS"]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session = requests.Session()
    session.mount("https://", adapter)
    session.mount("http://", adapter)

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.google.com/",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
    }
    
    try:
        # Step 1: Get the main astrology page to find the daily article
        response = session.get(base_url, headers=headers, timeout=30)
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
                if any(x in href for x in ["numerology", "tarot", "love-horoscope", "career-and-money", "daily-horoscope"]):
                    continue
                
                # Check if it matches today's date
                # exact check: date string in slug
                if date_str_padded in href or date_str_simple in href:
                    article_link = href
                    break
                
                # relaxed check: month and day (in case year is missing or format differs)
                if target_month in href and target_day in href:
                    candidates.append(href)
        
        # If no exact match with "horoscope-today" prefix, check any link with date
        if not article_link and not candidates:
            for a in soup.find_all('a', href=True):
                href = a['href']
                if (date_str_padded in href or date_str_simple in href) and "horoscope" in href:
                     if not any(x in href for x in ["numerology", "tarot", "love-horoscope", "career-and-money"]):
                        candidates.append(href)
        
        if not article_link and candidates:
            # Pick the first candidate if exact match failed
            print(f"Exact date match not found, using best candidate: {candidates[0]}")
            article_link = candidates[0]
            
        if article_link and not article_link.startswith('http'):
            article_link = f"https://www.hindustantimes.com{article_link}"

        if not article_link:
            print(f"Could not find the daily horoscope article link for {date_str_simple} or {date_str_padded}.")
            print("Available 'horoscope-today' links found:")
            for a in soup.find_all('a', href=True):
                if "horoscope-today" in a['href']:
                    print(f" - {a['href']}")
            return

        print(f"Found article: {article_link}")
        
        # Step 2: Fetch the article content
        time.sleep(2) # Be polite
        article_response = session.get(article_link, headers=headers, timeout=30)
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
                
                # Find all potential start indices
                potential_starts = []
                for i, line in enumerate(lines):
                    # Check for "Aries (March..." or just "Aries" header
                    if sign in line and ("(" in line or len(line.strip()) < 30):
                        # Double check it's not just a mention in another paragraph
                        if len(line.strip()) < 100: 
                            potential_starts.append(i)
                
                valid_chunk_found = False
                
                for start_idx in potential_starts:
                    horoscope_text = ""
                    lucky_number = "N/A"
                    lucky_color = "N/A"
                    compatibility = "N/A" 
                    
                    # Read subsequent lines to verify this is the real section
                    current_chunk = []
                    found_next_sign = False
                    
                    for j in range(start_idx + 1, len(lines)):
                        line = lines[j].strip()
                        if not line: continue
                        
                        # Stop if we hit the next sign or end of article markers
                        # Be careful not to stop on mentions of other signs within the text
                        # But typically headers are short.
                        if any(s in line for s in signs if s != sign and len(line) < 50):
                            found_next_sign = True
                            break
                        if "By:" in line:
                            break
                            
                        current_chunk.append(line)
                    
                    # Heuristic: Real horoscope sections have some content (e.g. > 50 chars)
                    # TOC sections usually break immediately (empty chunk) or have very little text
                    raw_text = "\n".join(current_chunk)
                    
                    match_info = f"Line {start_idx}: {line.strip()[:30]}"
                    if len(raw_text) > 50:
                        # Success! We found the real section
                        valid_chunk_found = True
                        
                        # Extract Lucky Number/Color if present
                        ln_match = re.search(r"Lucky Number:\s*(\d+)", raw_text, re.IGNORECASE)
                        if ln_match:
                            lucky_number = ln_match.group(1)
                            
                        lc_match = re.search(r"Lucky Colou?r:\s*([A-Za-z]+)", raw_text, re.IGNORECASE)
                        if lc_match:
                            lucky_color = lc_match.group(1)
                            
                        clean_text = raw_text
                        if "Lucky Number" in clean_text:
                            clean_text = clean_text.split("Lucky Number")[0].strip()
                        
                        clean_text = clean_text.replace("Love Focus:", "\n\nLove Focus:")
                        
                        if clean_text.startswith(sign):
                            clean_text = clean_text[len(sign):].strip()
                            
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
                        break # Stop searching potential starts for this sign
                    else:
                        print(f"DEBUG: Rejected {match_info} -> Len {len(raw_text)}. Next sign found? {found_next_sign}")
                        if len(current_chunk) > 0:
                             print(f"   Sample: {current_chunk[0][:20]}...")
                
                if not valid_chunk_found:
                    print(f"Could not find valid section for {sign}")

            except Exception as e:
                print(f"Error processing {sign}: {e}")
                
    except Exception as e:
        print(f"Global error: {e}")

if __name__ == "__main__":
    get_daily_horoscope()