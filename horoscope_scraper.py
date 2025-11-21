import requests
from bs4 import BeautifulSoup
import time

def get_daily_horoscope():
    signs = [
        "aries", "taurus", "gemini", "cancer", "leo", "virgo", 
        "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
    ]
    
    base_url = "https://timesofindia.indiatimes.com/astrology/horoscope"
    
    print(f"Fetching daily horoscopes for {time.strftime('%Y-%m-%d')}...\n")
    
    for sign in signs:
        try:
            # Step 1: Get the sign's main page
            sign_url = f"{base_url}/{sign}"
            response = requests.get(sign_url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Step 2: Find the link to the daily horoscope article
            # Looking for a link that contains "daily-horoscope-today"
            article_link = None
            for a in soup.find_all('a', href=True):
                if f"{sign}-daily-horoscope-today" in a['href']:
                    article_link = a['href']
                    break
            
            if not article_link:
                print(f"Could not find daily horoscope link for {sign.capitalize()}")
                continue
                
            # Handle relative URLs if necessary (though TOI usually uses absolute)
            if not article_link.startswith('http'):
                article_link = f"https://timesofindia.indiatimes.com{article_link}"
                
            # Step 3: Fetch the article page
            article_response = requests.get(article_link)
            article_response.raise_for_status()
            article_soup = BeautifulSoup(article_response.content, 'html.parser')
            
            # Step 4: Extract the horoscope text
            # The text is usually in the main article body. 
            # We'll look for the content div. TOI structure can be complex, 
            # but often the text is in a div with specific classes or just paragraphs.
            # A robust way is to find the 'Health Horoscope' header and get text before it,
            # or just get all text from the main article container.
            
            # Extraction logic
            full_text = article_soup.get_text(separator='\n')
            
            start_marker = "Neeraj Dhankher"
            end_marker = "Health Horoscope"
            
            horoscope_text = ""
            if start_marker in full_text and end_marker in full_text:
                start_idx = full_text.find(start_marker) + len(start_marker)
                end_idx = full_text.find(end_marker)
                extracted = full_text[start_idx:end_idx].strip()
                # Clean up lines
                lines = [line.strip() for line in extracted.split('\n') if line.strip()]
                # Filter out short lines (likely metadata) and keep substantial text
                horoscope_text = "\n".join([l for l in lines if len(l) > 20])
            
            if not horoscope_text:
                # Fallback: Meta description
                meta_desc = article_soup.find('meta', attrs={'name': 'description'})
                if meta_desc:
                    horoscope_text = meta_desc['content']
                else:
                    horoscope_text = "Horoscope text not found."

            print(f"--- {sign.capitalize()} ---")
            print(horoscope_text)
            print("\n")
            
            # Be nice to the server
            time.sleep(1)
            
        except Exception as e:
            print(f"Error fetching {sign}: {e}")

if __name__ == "__main__":
    get_daily_horoscope()
