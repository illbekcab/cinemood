import os
import httpx
import google.generativeai as genai
from typing import List
import json
import logging
from dotenv import load_dotenv

load_dotenv("../.env")

logger = logging.getLogger(__name__)

# Configuration
GEMINI_API_KEY = os.getenv("API_KEY")
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

# Initialize Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

async def analyze_mood(mood: str) -> List[int]:
    """
    Uses Gemini AI to convert a mood/situation description into TMDB genre IDs.
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY":
        logger.warning("Gemini API Key is missing or default placeholder. Using fallback.")
        return [28, 12] # Action, Adventure

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Given the following user mood or situation, identify the most appropriate TMDB movie genre IDs (integers). 
        User Mood: "{mood}"
        
        TMDB Genres mapping: 
        Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80, Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36, Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749, Science Fiction: 878, TV Movie: 10770, Thriller: 53, War: 10752, Western: 37.

        Return ONLY a JSON array of genre IDs that best match this mood. Limit to 3 genres max.
        Example: [28, 53]
        """
        
        response = await model.generate_content_async(prompt)
        
        # Check if response has text (could be blocked by safety filters)
        try:
            text = response.text.strip()
        except Exception as safety_err:
            logger.error(f"Gemini response has no text (safety or other issue): {safety_err}")
            return [18]

        # Extract JSON array if there's any surrounding text
        if "[" in text and "]" in text:
            text = text[text.find("["):text.rfind("]")+1]
        
        try:
            genre_ids = json.loads(text)
            return genre_ids if isinstance(genre_ids, list) else [18]
        except json.JSONDecodeError:
            logger.error(f"Failed to parse Gemini response as JSON: {text}")
            return [18]
    except Exception as e:
        logger.error(f"Error analyzing mood with Gemini: {e}")
        return [18] # Fallback to Drama

async def fetch_movies(genre_ids: List[int]) -> List[dict]:
    """
    Fetches movies from TMDB based on genre IDs.
    """
    # Use fallback test key if env is missing or placeholder
    tmdb_key = TMDB_API_KEY
    if not tmdb_key or tmdb_key == "8309e3966563600f723927d2c0b46761": # Keep the test key as fallback
        tmdb_key = "8309e3966563600f723927d2c0b46761"

    genre_string = ",".join(map(str, genre_ids))
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{TMDB_BASE_URL}/discover/movie",
                params={
                    "api_key": tmdb_key,
                    "with_genres": genre_string,
                    "sort_by": "popularity.desc",
                    "vote_count.gte": 100,
                    "page": 1
                },
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()
            return data.get("results", [])
        except Exception as e:
            logger.error(f"Error fetching movies from TMDB: {e}")
            return []
